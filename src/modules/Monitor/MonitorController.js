function MonitorController($scope, $interval, WorkersService, NotificationService, ConfigService, $state, ModuleService) {
  $scope.activeModule = ModuleService.changeActiveModule("Monitor");
  $interval(_ => {
    const logs = WorkersService.getLogs();
    if(logs && logs.hasOwnProperty("error") && Array.isArray(logs.error) && logs.error.length > 0)
      NotificationService.add('error', "There is one or more problem with the session, verify logs")
  }, ConfigService.refresh);
}
module.exports = MonitorController;
