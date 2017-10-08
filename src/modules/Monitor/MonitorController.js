function MonitorController ($scope, $interval, WorkersService, ConfigService, $state, ModuleService) {
  $scope.activeModule = ModuleService.changeActiveModule('Monitor');
}
module.exports = MonitorController;
