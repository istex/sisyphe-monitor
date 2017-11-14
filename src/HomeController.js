const request = require('request-promise');
function HomeController ($scope, $interval, ModuleService, $state, ConfigService, WorkersService) {
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
  // $state.go('Monitor');
}
module.exports = HomeController;
