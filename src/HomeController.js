function HomeController ($scope, ModuleService, $state, ConfigService, WorkersService) {
  $scope.activeModule = _ => ModuleService.activeModule;
  const host = ConfigService.get('host') || 'localhost';
  $scope.Model = { host };
  WorkersService.changeHost(host);
  $state.go('Monitor');
}
module.exports = HomeController;
