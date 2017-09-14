const monitorHelpers = require('./monitorHelpers');

/**
 * Its role is to manage the data for monitor and update views
 * @constructor
 * @return {Object} this object
 */
function MonitorController () {
  this.workersData = {
    
  };
  
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
  // dispatch all workers by status (waiting, current, done)
  const routerResult = this.router(data);
  if (data.hasOwnProperty('workersError') && data.workersError) this.nbFailed = data.workersError.length;
  else this.nbFailed = 0;
  for (var worker in this.workersData.waitingModules) {
    if (this.workersData.waitingModules.hasOwnProperty(worker)) {
      var element = this.workersData.waitingModules[worker];
      element.failed = this.nbFailed;
    }
  }
  if (!routerResult.thereIsACurrent) {
    // if no workers are in current queue, the current queue is keep and worker in current queue is remove from waiting queue
    if (this.workersData.currentModule.hasOwnProperty('name')) {
      delete this.workersData.waitingModules[this.workersData.currentModule.name];
    }
  }


  // if there's no worker in current queue, we format data to display
  // Total percent
  let allDone = this.maxFile * monitorHelpers.nbProperty(this.workersData.doneModules);
  if (this.workersData.currentModule.waiting) allDone += this.maxFile - (this.workersData.currentModule.waiting);
  this.totalPercent = ~~(allDone * 100 / (this.maxFile * routerResult.nbWorkers));
  this.logs = data.log;
  if (!monitorHelpers.nbProperty(this.workersData.currentModule) || this.totalPercent === 100) {
    this.workersData.currentModule = {
      name: 'None',
      waiting: '',
      completed: '',
      failed: ''
    };
  }
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
  this.failed = 0;
  for (var workerName in data.workers) {
    const worker = data.workers[workerName];
    if (workerName === 'walker-fs' || workerName === 'start' || workerName === 'end' || !this.listWorkers[worker.name]) continue;
    nbWorkers++;
    if (this.listWorkers[worker.name].waiting > worker.waiting) {
      // if previous waiting of worker is superior than current waiting, it's a working worker
      thereIsACurrent = true;
      delete this.workersData.waitingModules[worker.name];
      delete this.workersData.doneModules[worker.name];
      worker.completed = this.maxFile - worker.waiting;
      this.workersData.currentModule = worker;
    } else if (worker.waiting || +worker.maxFile + this.nbFailed < this.maxFile) {
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
  this.maxFile = data.workers.filetype.maxFile;
  this.listWorkers = data.workers;
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
  this.updateData(data);
  return this;
};

module.exports = MonitorController;
