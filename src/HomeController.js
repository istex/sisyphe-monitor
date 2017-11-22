const request = require('request-promise');
const cp = require("child_process");
const pathfs = require('path')
const Promise = require('bluebird')
const redis = require("redis");
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();
let redisConnection = false
client.on("error", _ => (redisConnection = false));
client.on("ready", _ => (redisConnection = true));


// HomeController.$inject = [ "$scope", "$interval", "ModuleService", "$state", "ConfigService", "NotificationService", "WorkersService" ];
function HomeController ( $scope, $interval, ModuleService, $state, ConfigService, NotificationService, WorkersService, ModalService) {
  HomeController.$inject.map((dependency, index)=> this[dependency]= arguments[index])
  this.loadWorkers()
  this.checkUpdates()
  this.checkConnection()
  this.loadHost()
  this.launchRedis()
  if (!ConfigService.get('debug')) ConfigService.save({debug: false})
}
HomeController.prototype.launchRedis = function() {
  if (!redisConnection) {
    const pathToRedisServer = pathfs.resolve(__dirname, '..', 'lib', 'redis-linux-64', 'src', 'redis-server')
    const spawnRedis = cp.spawn(pathToRedisServer)
    setTimeout(function() {
      spawnRedis.kill('SIGTERM')
    }, 3000);
  }
};

HomeController.prototype.loadHost = function () {
  const $scope = this.$scope
  const ConfigService = this.ConfigService
  const WorkersService = this.WorkersService
  const host = ConfigService.get('host');
  if (!host) ConfigService.save({ host: 'localhost', serverUrl: 'http://localhost:3264/' });
  WorkersService.changeHost(host);
  $scope.Model = { host };
  
}

HomeController.prototype.checkConnection = function () {
  const $scope = this.$scope
  const $interval = this.$interval
  const ConfigService = this.ConfigService
  $interval(_ => {
    const serverConnection = $scope.serverConnection;
    request({ url: ConfigService.get("serverUrl") + "ping", timeout: 2000 })
      .then(data => {
        if (data === "pong") $scope.serverConnection = true;
        else $scope.serverConnection = false;
      })
      .catch(_ => ($scope.serverConnection = false));
  }, 1000);
}

HomeController.prototype.loadWorkers = function(){
  const ConfigService = this.ConfigService;
  const $interval = this.$interval
  $interval( function () {
    if (!ConfigService.get("workers")) {
      request(ConfigService.get("serverUrl") + "workers")
        .then(function(workers) {
          workers = JSON.parse(workers);
          workers = workers.workers.map(worker => ({ name: worker, disable: false }));
          ConfigService.save({ workers });
          clearInterval(this);
        }); 
    }
  }, ConfigService.refresh);
}

HomeController.prototype.checkUpdates = function () {
  const $state = this.$state
  const NotificationService = this.NotificationService
  if (!$state.alreadyCheckIfUpdateAvailable) {
    request({ 
      url: 'https://api.github.com/repos/istex/sisyphe-monitor/releases/latest', 
      timeout: 2000, 
      headers: {
        'User-Agent': 'request'
      },
    }).then(data => {
      const remoteVersion = JSON.parse(data).tag_name.split('v')[1]
      const version = require('../package').version
      if (version === remoteVersion) NotificationService.add("info", `Monitor is up to date: v${version}`);
      else NotificationService.add("warning", `Monitor is not up to date: v${version} -> v${remoteVersion} (https://github.com/istex/sisyphe-monitor/releases/latest)`);
    })
    .catch(err => {
      console.log('kljjkl')
      NotificationService.add('info', 'Go online to check updates')
    })
    $state.alreadyCheckIfUpdateAvailable = true
  }
}
module.exports = HomeController;