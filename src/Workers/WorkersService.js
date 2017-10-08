const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const _lo = require('lodash');
// const MonitorController = require('./core/monitorController');

/**
 * Its role is to manage the refreshments loop and inject the data in the controller
 * @param       {Object} [] Can have properties: refresh, prefix
 * @constructor
 * @return {Object} this object
 */
function WorkersService (ConfigService) {
  this.redisKeys = {};
  this.redisConnection = false;
  this.monitoring = {};
  this.modules = {
    doneModules: {},
    currentModule: {},
    waitingModules: {}
  };
  this.percents = {
    totalPercent: 0,
    percent: 0
  };
  this.maxFile = 0;
  this.status = 'Waiting';
  this.time = {};
  setInterval(async _ => {
    this.monitoring = await this.getMonitoring();
    this.getStatus();
    this.getTime();
    if (!this.monitoring || !this.monitoring.hasOwnProperty('workers')) return;
    const workers = await Promise.all(
      this.monitoring.workers
        .map(async (worker, index) => {
          const job = await this.getJobsFrom(worker);
          job.id = index;
          return job;
        })
    );
    this.dispatchWorkers(workers);
    this.calculPercentages(this.modules, workers.length, this.maxFile);
  }, ConfigService.refresh);
}

WorkersService.prototype.getMonitoring = async function () {
  if (!this.host) return;
  const keys = await this.client.hkeysAsync('monitoring');
  this.monitoring = {};
  await Promise.map(keys, async key => {
    let val = await this.client.hgetAsync('monitoring', key);
    try {
      this.monitoring[key] = JSON.parse(val);
    } catch (err) {
      this.monitoring[key] = val;
    }
  });
  return this.monitoring;
};

/**
 * Searches all keys in redis and stores them in the local object
 * @return {Promise} Promise resolve with all key in redis
 */
WorkersService.prototype.getJobsFrom = async function (worker) {
  const wait = +await this.client.lindexAsync(`bull:${worker}:wait`, 0);
  const max = +await this.client.getAsync(`bull:${worker}:id`);
  const waiting = +await this.client.lindexAsync(`bull:${worker}:wait`, -1);
  return {
    name: worker,
    waiting,
    wait,
    max
  };
};
WorkersService.prototype.getTime = function () {
  const startDateInMs = this.monitoring.start;
  const endDateInMs = this.monitoring.end ? this.monitoring.end : Date.now();
  const time = new Date();
  time.setSeconds((endDateInMs - startDateInMs) / 1000);
  time.setMinutes((endDateInMs - startDateInMs) / (1000 * 60));
  time.setHours((endDateInMs - startDateInMs) / (1000 * 60 * 60));
  time.setDate(~~((endDateInMs - startDateInMs) / (1000 * 60 * 60 * 24)));
  const timeObject = {
    days: (time.getDate() >= 28) ? 0 : time.getDate(),
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds()
  };
  this.time = timeObject;
};
WorkersService.prototype.getStatus = function () {
  if (this.monitoring.end) this.status = 'End';
  if (this.monitoring.start && !this.monitoring.end) this.status = 'Working';
};
WorkersService.prototype.changeHost = async function (host) {
  this.redisConnection = false;
  this.host = host;
  this.client = redis.createClient({host: this.host});
  this.client.infoAsync((noErr, response) => (this.redisConnection = true));
  this.client.on('error', async noErr => {
    this.redisConnection = false;
    await this.client.infoAsync();
    this.redisConnection = true;
  });
};

WorkersService.prototype.getLogs = function () {
  return this.monitoring.log;
};

WorkersService.prototype.isRunning = function () {
  return this.redisConnection;
};

WorkersService.prototype.calculPercentages = function (modules, nbWorkers, nbTotalOfFiles) {
  let allDone = nbTotalOfFiles * Object.keys(modules.doneModules).length;
  if (modules.currentModule.waiting) allDone += nbTotalOfFiles - modules.currentModule.wait;
  this.percents.percent = percentage(modules.currentModule.waiting, nbTotalOfFiles);
  this.percents.totalPercent = ~~(allDone * 100 / (nbTotalOfFiles * nbWorkers));
};

WorkersService.prototype.dispatchWorkers = function (workers) {
  const modules = {
    doneModules: {},
    currentModule: {},
    waitingModules: {}
  };
  workers.forEach((worker, index) => {
    if (this.maxFile < worker.max) this.maxFile = worker.max;
    if (worker.wait === 0 && worker.max === 0) modules.waitingModules[worker.name] = worker;
    else if (worker.wait === 0 && worker.max !== 0) modules.doneModules[worker.name] = worker;
    else {
      const workerBefore = workers[this.monitoring.workers.indexOf(worker.name) - 1];
      if (workerBefore && worker.wait > workerBefore.wait) {
        modules.currentModule = { name: worker.name, waiting: worker.waiting, wait: this.maxFile - worker.waiting };
      } else {
        modules.waitingModules[worker.name] = worker;
      }
    }
  });
  _lo.extend(this.modules, modules);
};

function percentage (nb, total) {
  const percent = nb * 100 / total;
  if (!percent) return 0;
  else return percent.toFixed(1);
}

module.exports = WorkersService;
