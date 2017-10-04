const request = require('request-promise');
function HomeController ($scope, $interval, ModuleService, $state, ConfigService, WorkersService) {
  if (!ConfigService.get('workers')) {
    request(ConfigService.get('serverUrl') + 'workers').then(function (workers) {
      workers = JSON.parse(workers);
      workers = workers.workers.map(function(worker){
        return {name: worker,disable: false};
      });
      ConfigService.save({workers})
    });
  }
  setInterval(_ => {
    request({ url: ConfigService.get("serverUrl") + "ping", timeout: 2000 })
      .then(data => {
        if (data === "pong") $scope.serverConnection = true;
        else $scope.serverConnection = false;
      })
      .catch(err => {
        $scope.serverConnection = false;
      });
  }, 1000);
  // $scope.activeModule = _ => ModuleService.activeModule;
  const host = ConfigService.get('host') || 'localhost';
  $scope.Model = { host };
  WorkersService.changeHost(host);
  // $state.go('Monitor');
}
module.exports = HomeController;
