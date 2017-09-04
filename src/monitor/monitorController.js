const blessed = require('blessed');
const contrib = require('blessed-contrib');
const colors = require('colors/safe');
const components = require('./component');
const monitorHelpers = require('./monitorHelpers');
const os = require('os');

/**
 * Its role is to manage the data for monitor and update views
 * @constructor
 * @return {Object} this object
 */
function MonitorController() {
  this.screen = blessed.screen({
    smartCSR: true
  });

  this.grid = new contrib.grid({
    rows: 16,
    cols: 16,
    screen: this.screen
  });
  this.workersView = components.loadInterface(this.grid);
  this.screen.key(['C-c'], (ch, key) => {
    this.workersView.question.setIndex(Infinity);
    this.workersView.question.ask('Do you want to quit Sisyphe ?', function (err, res) {
      if (res === true) {
        process.exit(0);
      }
    });
  });
  this.workersData = {
    waitingModules: {},
    doneModules: {},
    currentModule: {}
  };
  this.maxFile = 0;
  this.listWorkers = [];
  return this;
}

/**
 * Manage data before update views
 * @param  {Object} data contain: startDate, endDate, data(countJobs)
 * @return {Object}      this
 */
MonitorController.prototype.updateData = function (data) {
  // timer
  if (data.hasOwnProperty('startDate')) this.startDate = data.startDate;
  if (data.hasOwnProperty('endDate')) this.endDate = data.endDate;
  if (!data.endDate) this.time = monitorHelpers.getTimeBetween(data.startDate, Date.now());
  else this.time = monitorHelpers.getTimeBetween(data.startDate, data.endDate);
  // dispatch failed task
  for (var workerKey in data.workersError) {
    if (data.workersError.hasOwnProperty(workerKey)) {
      var nbFailed = data.workersError[workerKey].length;
      const workers = Object.keys(this.listWorkers)
      const arrayToInjectErrors = workers.slice(workers.indexOf(workerKey)+1)
      for (var i = 0; i < arrayToInjectErrors.length; i++) {
        var element = data.workers[arrayToInjectErrors[i]];
        element.failed+= nbFailed
      }
    }
  }
  // dispatch all workers by status (waiting, current, done)
  const routerResult = this.router(data);
  if (!routerResult.thereIsACurrent) {
    // if no workers are in current queue, the current queue is keep and worker in current queue is remove from waiting queue
    if (this.workersData.currentModule.hasOwnProperty('name')) {
      delete this.workersData.waitingModules[this.workersData.currentModule.name];
    }
  }


  // if there's no worker in current queue, we format data to display
  if (!monitorHelpers.nbProperty(this.workersData.currentModule)) {
    this.workersData.currentModule = {
      name: 'None',
      waiting: '',
      completed: '',
      failed: ''
    };
  }
  // Total percent
  let allDone = this.maxFile * monitorHelpers.nbProperty(this.workersData.doneModules);
  if (this.workersData.currentModule.waiting) allDone += this.maxFile - (this.workersData.currentModule.waiting + this.failed);
  this.totalPercent = ~~(allDone * 100 / (this.maxFile * routerResult.nbWorkers));
  this.logs = data.log;
  return this;
};

/**
 * Update component of view with data
 * @return {Object}      this
 */
MonitorController.prototype.updateView = function () {
  this.workersView.waitingModules.setData({
    headers: ['Modules', 'waiting', 'error'],
    data: monitorHelpers.propertyToArray(this.workersData.waitingModules)
  });

  this.workersView.currentModule.setData({
    headers: ['Module ' + this.workersData.currentModule.name],
    data: [
      [colors.blue('waiting'), colors.blue(this.workersData.currentModule.waiting)],
      [colors.green('completed'), colors.green(this.workersData.currentModule.completed)],
      [colors.red('failed'), colors.red(this.workersData.currentModule.failed)]
    ]
  });

  this.workersView.doneModules.setData({
    headers: ['Modules', 'waiting', 'error'],
    data: monitorHelpers.propertyToArray(this.workersData.doneModules)
  })
  if (this.maxFile) {
    this.workersView.walker.setContent('Walker-fs has found ' + this.maxFile.toString() + ' files');
  }
  const days = (this.time.getDate() === 31) ? 0 : this.time.getDate()
  this.workersView.time.setContent(
    days +
    ' days\n' +
    this.time.getHours() +
    ' hours \n' +
    this.time.getMinutes() +
    ' minutes\n' +
    this.time.getSeconds() +
    ' seconds\n'
  );
  const logs = monitorHelpers.getColorLog(this.logs);
  this.workersView.logs.setContent(logs.join('\n'))

  const percent = ~~((this.maxFile - this.workersData.currentModule.waiting) * 100 / this.maxFile);
  this.workersView.progress.setStack([
    {
      percent,
      stroke: monitorHelpers.getColorOfPercent(percent)
    }
  ]);

  this.workersView.total.setData([
    {
      label: 'Total',
      percent: this.totalPercent,
      color: monitorHelpers.getColorOfPercent(this.totalPercent)
    }
  ]);

  const loadavg = os.loadavg();
  for (var i = 0; i < loadavg.length; i++) {
    loadavg[i] = loadavg[i].toFixed(1) + ' ';
  }
  this.workersView.loadAverage.setContent(loadavg.toString());
  return this;
};

/**
 * Dispatch all workers by status (waiting, current, done)
 * @param  {Object[]} workers Array containing jobs count
 * @return {Object}         Object containing if a worker is running and number of worker
 */
MonitorController.prototype.router = function (data) {
  let nbWorkers = 0;
  let thereIsACurrent = false;
  this.failed = 0
  for (var workerName in data.workers) {
    const worker = data.workers[workerName]
    if (workerName === 'walker-fs' || workerName === 'start' || workerName === 'end' || !this.listWorkers[worker.name]) continue;
    nbWorkers++;
    if (this.listWorkers[worker.name].waiting > worker.waiting) {
      // if previous waiting of worker is superior than current waiting, it's a working worker
      thereIsACurrent = true;
      delete this.workersData.waitingModules[worker.name];
      delete this.workersData.doneModules[worker.name];
      worker.completed = this.maxFile - worker.waiting;
      this.workersData.currentModule = worker;
    } else if (worker.waiting || +worker.maxFile + +worker.failed < this.maxFile) {
      // if there's waiting job or completed task is inferior than totalFile, it's a waiting worker
      delete this.workersData.doneModules[worker.name];
      this.workersData.waitingModules[worker.name] = worker;
    } else {
      // if this is not an waiting or working worker, it's a done worker
      delete this.workersData.waitingModules[worker.name];
      this.workersData.doneModules[worker.name] = worker;
    }
    this.listWorkers[worker.name].waiting = worker.waiting;
  }
  this.maxFile = data.workers[Object.keys(data.workers)[1]].maxFile
  this.listWorkers=data.workers
  return {
    thereIsACurrent,
    nbWorkers
  };
};

/**
 * Update monitorController
 * @param  {Object} data contain: startDate, endDate, data(countJobs)
 * @return {Object}      this object
 */
MonitorController.prototype.refresh = function (data) {
  this.updateData(data).updateView().screen.render();
  return this;
};

module.exports = MonitorController;
