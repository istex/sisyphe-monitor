const request = require('request-promise');
function HomeController ($scope, $interval, ModuleService, $state, ConfigService, NotificationService, WorkersService) {
  const loadWorkers = $interval(_ => {
    if (!ConfigService.get('workers')) {
      request(ConfigService.get('serverUrl') + 'workers').then(function (workers) {
        workers = JSON.parse(workers);
        workers = workers.workers.map(function (worker) {
          return { name: worker, disable: false };
        });
        ConfigService.save({ workers });
        clearInterval(loadWorkers);
      });
    }
  }, 1000);
  $interval(_ => {
    const serverConnection = $scope.serverConnection
    request({ url: ConfigService.get('serverUrl') + 'ping', timeout: 2000 })
      .then(data => {
        if (data === 'pong') $scope.serverConnection = true;
        else $scope.serverConnection = false;
      })
      .catch(_ => ($scope.serverConnection = false));
  }, 1000);
  const host = ConfigService.get('host');
  if (!ConfigService.get('debug')) {
    ConfigService.save({debug: false})
  }
  if (!host) {
    ConfigService.save({
      host: 'localhost',
      serverUrl: 'http://localhost:3264/'
    });
  }
  $scope.Model = { host };
  WorkersService.changeHost(host);
  request({ 
    url: 'https://api.github.com/repos/istex/sisyphe-monitor/releases/latest', 
    timeout: 2000, 
    headers: {
      'User-Agent': 'request'
    },
  }).then(data => {
      const remoteVersion = JSON.parse(data).tag_name.split('v')[1]
      const version = require('../package').version
      if (remoteVersion === version) NotificationService.add("info", "Monitor is up to date")
      else NotificationService.add("info", `Monitor is not up to date: v${version} -> v${remoteVersion} (https://github.com/istex/sisyphe-monitor/releases/latest)`);
    })
    .catch(err => {
      console.log('kljjkl')
      NotificationService.add('info', 'Go online to check updates')
    })
  // $state.go('Monitor');
}
module.exports = HomeController;
