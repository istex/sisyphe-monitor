const Queue = require('bull');
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
  this.host = 'localhost'
  this.client = redis.createClient({ host: this.host });
  this.redisConnection = true;
  this.monitoring = {};
  this.client.on('error', async (err) => {
    this.redisConnection = false
    await this.client.infoAsync()
    this.redisConnection = true
  })
}

Monitor.prototype.getMonitoring = async function () {
  const keys = await this.client.hkeysAsync('monitoring');
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
  const wait = +(await this.client.lindexAsync(`bull:${worker}:wait`, 0));
  const max = +(await this.client.getAsync(`bull:${worker}:id`));
  const waiting = +(await this.client.lindexAsync(`bull:${worker}:wait`, -1))
  return {
    name: worker,
    waiting,
    wait,
    max
  };
};
Monitor.prototype.changeHost = function (host) {
  this.redisConnection = false;
  this.host = host;
  this.client = redis.createClient({ host: this.host });
  this.client.info((err, response) => (this.redisConnection = true));
};

Monitor.prototype.getLogs = function() {
  return this.monitoring.log
}

Monitor.prototype.isRunning = function () {
  return this.redisConnection;
};

module.exports = Monitor;
