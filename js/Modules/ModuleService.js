const Queue = require("bull");
const Promise = require("bluebird");

const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const MonitorController = require("./monitor/monitorController");

/**
 * Its role is to manage the refreshments loop and inject the data in the controller
 * @param       {Object} [options={}] Can have properties: refresh, prefix
 * @constructor
 * @return {Object} this object
 */
function Monitor(options = {}) {
  options = {}
  this.refresh = options.refresh && options.refresh > 40 ? options.refresh : 40;
  this.workers = [];
  this.redisKeys = {};
  this.prefix = 'bull';
  this.host = 'localhost';
  this.client = redis.createClient({ host: this.host });
  this.redisConnection = false
  this.client.info((err, response)=>{
    this.redisConnection = true
  })
};

/**
 * Launches the monitor and injects the data that is needed
 * @return {Object} this object
 */
Monitor.prototype.launch = function() {
  this.monitorController = new MonitorController();
  this.intervalLoop = setInterval(async () => {
    const monitoring = await this.getMonitoring();
    if (!monitoring.hasOwnProperty("workers")) return;
    const queues = await this.getQueue(monitoring.workers);
    const workers = {};
    await Promise.map(queues, async queue => {
      const jobsCount = await queue.getJobCounts();
      jobsCount.name = queue.name;
      jobsCount.maxFile = this.redisKeys[queue.name].maxFile;
      delete jobsCount.delayed;
      delete jobsCount.active;
      delete jobsCount.completed;
      workers[queue.name] = jobsCount;
    })
    .then(async data => {
      this.monitorController.refresh({
        workers,
        startDate: monitoring.start,
        endDate: monitoring.end,
        log: monitoring.log,
        workersError: monitoring.workersError
      });
      return data;
    })
    .catch(err => {
      console.log(err);
    });
  }, 100);
  return this;
};

Monitor.prototype.getMonitoring = async function() {
  const monitoring = {};
  const keys = await this.client.hkeysAsync("monitoring");
  await Promise.map(keys, async key => {
    monitoring[key] = JSON.parse(
      await this.client.hgetAsync("monitoring", key)
    );
  });
  return monitoring;
};

/**
 * Searches all keys in redis and stores them in the local object
 * @return {Promise} Promise resolve with all key in redis
 */
Monitor.prototype.getQueue = async function(workers) {
  await Promise.map(workers, async worker => {
    if (!this.redisKeys[worker]) {
      this.redisKeys[worker] = {};
      const queue = new Queue(worker, {
        redis: { port: 6379, host: this.host },
        prefix: this.prefix
      });
      this.workers.push(queue);
    }
    this.redisKeys[worker].maxFile = await this.client.getAsync(
      `${this.prefix}:${worker}:id`
    );
  });
  return this.workers;
};
Monitor.prototype.getWaitings = function() {
  return this.monitorController.workersData.waitingModules;
};
Monitor.prototype.getCurrent = function() {
  return this.monitorController.workersData.currentModule;
};
Monitor.prototype.getDones = function() {
  return this.monitorController.workersData.doneModules;
};
Monitor.prototype.getLogs = function() {
  return this.monitorController.logs;
};

Monitor.prototype.getCurrentPercent = function() {
  const currentModule = this.monitorController.workersData.currentModule;
  const maxFile = +currentModule.waiting + +currentModule.completed + +currentModule.failed
  const percent = ((+currentModule.completed + +currentModule.failed) * 100 ) / maxFile
  if (!percent) return 0
  else return percent.toFixed(1)
};

Monitor.prototype.getTotalPercent = function() {
  return this.monitorController.totalPercent;
};

Monitor.prototype.isRunning = function() {
  return this.redisConnection;
};


module.exports = Monitor;
