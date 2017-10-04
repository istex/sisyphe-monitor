const request = require('request-promise');
function HomeController ($scope, ModuleService, $state, ConfigService, WorkersService) {
  if (!ConfigService.get('workers')) {
    request(ConfigService.get('serverUrl') + 'workers').then(function (workers) {
      workers = JSON.parse(workers);
      workers = workers.workers.map(function(worker){
        return {name: worker,disable: false};
      });
      console.log(workers)
      ConfigService.save({workers})
    });
  }
  $scope.activeModule = _ => ModuleService.activeModule;
  const host = ConfigService.get('host') || 'localhost';
  $scope.Model = { host };
  WorkersService.changeHost(host);
  $state.go('Monitor');
}
module.exports = HomeController;
