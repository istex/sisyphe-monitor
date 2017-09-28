const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
// const MonitorController = require('./core/monitorController');

/**
 * Its role is to manage the refreshments loop and inject the data in the controller
 * @param       {Object} [options={}] Can have properties: refresh, prefix
 * @constructor
 * @return {Object} this object
 */
function Monitor (options = {}) {
  options = options || {};
  this.redisKeys = {};
  this.redisConnection = false;
  this.monitoring = {};
}

Monitor.prototype.getMonitoring = async function () {
  if (!this.host) return;
  const keys = await this.client.hkeysAsync('monitoring');
  this.monitoring = {};
  await Promise.map(keys, async key => {
    this.monitoring[key] = JSON.parse(
      await this.client.hgetAsync('monitoring', key)
    );
  });
  return this.monitoring;
};

/**
 * Searches all keys in redis and stores them in the local object
 * @return {Promise} Promise resolve with all key in redis
 */
Monitor.prototype.getJobsFrom = async function (worker) {
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
Monitor.prototype.getTime = function () {
  const startDateInMs = this.monitoring.start;
  const endDateInMs = this.monitoring.end ? this.monitoring.end : Date.now();
  const time = new Date();
  time.setSeconds((endDateInMs - startDateInMs) / 1000);
  time.setMinutes((endDateInMs - startDateInMs) / (1000 * 60));
  time.setHours((endDateInMs - startDateInMs) / (1000 * 60 * 60));
  time.setDate(~~((endDateInMs - startDateInMs) / (1000 * 60 * 60 * 24)));
  timeObject = {
    days: time.getDate() === 31 ? 0 : time.getDate(),
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds()
  };
  return timeObject;
};
Monitor.prototype.getStatus = function () {
  let status = 'Ready';
  if (this.monitoring.end) status = 'End';
  if (this.monitoring.start && !this.monitoring.end) status = 'Working';
  return status;
};
Monitor.prototype.changeHost = function (host) {
  this.redisConnection = false;
  this.host = host;
  this.client = redis.createClient({ host: this.host });
  this.client.info((err, response) => (this.redisConnection = true));
  this.client.on('error', async err => {
    this.redisConnection = false;
    await this.client.infoAsync();
    this.redisConnection = true;
  });
};

Monitor.prototype.getLogs = function () {
  return this.monitoring.log;
};

Monitor.prototype.isRunning = function () {
  return this.redisConnection;
};

Monitor.prototype.downloadFiles = async function () {
  await this.client.lpushAsync('download', 'dedededed');
  return new Promise((resolve, reject) => {
    const interval = setInterval(async _ => {
      let response = await this.client.lpopAsync('downloadResponse');
      if (response) {
        resolve(JSON.parse(response));
        clearInterval(interval);
      }
    }, 100);
  });
};

Monitor.prototype.launchCommand = function (command) {
  this.monitoring = {};
  return this.client.lpushAsync('command', command).catch(err => {
    console.log(err);
  });
};

module.exports = Monitor;
