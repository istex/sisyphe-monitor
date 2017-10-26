function MonitorController(
  $scope,
  $interval,
  WorkersService,
  ConfigService,
  $state,
  ModuleService
) {
  $scope.activeModule = ModuleService.changeActiveModule("Monitor");
  $interval(_ => {
    const logs = WorkersService.getLogs();
    $scope.thereIsAnErrorInLog =
      logs &&
      logs.hasOwnProperty("error") &&
      Array.isArray(logs.error) &&
      logs.error.length > 0
        ? true
        : false;
  }, ConfigService.refresh);
}
module.exports = MonitorController;
