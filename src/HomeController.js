const request = require('request-promise');
const cp = require('child_process');
const pathfs = require('path');
const ipcRenderer = require('electron').ipcRenderer;
const os = require('os');

function HomeController($scope, $interval, $timeout, $state, ConnectionService, ConfigService, NotificationService, WorkersService) {
  HomeController.$inject.map((dependency, index) => (this[dependency] = arguments[index]));
  this.loadWorkers();
  this.checkUpdates();
  this.loadHost();
  $scope.connections = ConnectionService.data;
  if (!ConfigService.get('debug')) ConfigService.save({debug: false});
  $timeout(_ => {
    if (!ConnectionService.data.redisConnection) this.launchRedis();
    if (!ConnectionService.data.serverConnection && !$state.server_isLocal) {
      $state.server_isLocal = true;
      $scope.server_isLocal = true;
      this.launchServer();
    }
    $scope.server_isLocal = $state.server_isLocal;
  }, 2000);
  $scope.server_isLocal = $state.server_isLocal || false;
  $scope.redis_isLocal = $state.redis_isLocal || false;
}

HomeController.prototype.launchRedis = function () {
  const $scope = this.$scope;
  let pathToRedisServer;
  if (os.platform() === 'linux') pathToRedisServer = pathfs.resolve(__dirname, '..', 'lib', 'redis-linux-64', 'src', 'redis-server');
  else if (os.platform() === 'darwin') pathToRedisServer = pathfs.resolve(__dirname, '..', 'lib', 'redis-darwin-64', 'src', 'redis-server');
  else if (os.platform() === 'win32') pathToRedisServer = pathfs.resolve(__dirname, '..', 'lib', 'redis-win-64', 'src', 'redis-server');
  if (pathToRedisServer) {
    const spawnRedis = cp.spawn(pathToRedisServer);
    ipcRenderer.send('pid', spawnRedis.pid);
    $scope.redis_isLocal = true;
  }
};

HomeController.prototype.launchServer = function () {
  const $scope = this.$scope;
  const pathToServer = pathfs.resolve(__dirname, '..', 'node_modules', 'sisyphe');
  const spawnServer = cp.fork(`${pathToServer}/server.js`);
  ipcRenderer.send('pid', spawnServer.pid);
  $scope.server_isLocal = true;
};

HomeController.prototype.loadHost = function () {
  const $scope = this.$scope;
  const ConfigService = this.ConfigService;
  const WorkersService = this.WorkersService;
  const host = ConfigService.get('host');
  if (!host) ConfigService.save({ host: 'localhost', serverUrl: 'http://localhost:3264/' });
  WorkersService.changeHost(host);
  $scope.Model = { host };
};

HomeController.prototype.loadWorkers = function () {
  const ConfigService = this.ConfigService;
  const $interval = this.$interval;
  $interval(_=> {
    if (!ConfigService.get('workers')) {
      request(ConfigService.get('serverUrl') + 'workers')
        .then(function (workers) {
          workers = JSON.parse(workers);
          workers = workers.workers.map(worker => ({ name: worker, disable: false }));
          ConfigService.save({ workers });
          clearInterval(this);
        }).catch(err => {});
    }
  }, ConfigService.refresh);
};

HomeController.prototype.checkUpdates = function () {
  const $state = this.$state;
  const NotificationService = this.NotificationService;
  if (!$state.alreadyCheckIfUpdateAvailable) {
    request({
      url: 'https://api.github.com/repos/istex/sisyphe-monitor/releases/latest',
      timeout: 2000,
      headers: {
        'User-Agent': 'request'
      }
    }).then(data => {
      const remoteVersion = JSON.parse(data).tag_name.split('v')[1];
      const version = require('../package').version;
      if (version === remoteVersion) NotificationService.add('info', `Monitor is up to date: v${version}`);
      else NotificationService.add('warning', `Monitor is not up to date: v${version} -> v${remoteVersion} (https://github.com/istex/sisyphe-monitor/releases/latest)`);
    })
    .catch(err => {
      NotificationService.add('info', 'Go online to check updates');
    });
    $state.alreadyCheckIfUpdateAvailable = true;
  }
};
module.exports = HomeController;
