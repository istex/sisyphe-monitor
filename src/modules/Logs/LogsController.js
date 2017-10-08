function LogsController ($scope, $interval, WorkersService, ConfigService, ModuleService) {
  ModuleService.changeActiveModule('Logs');
  $interval(_ => {
    let errors = {};
    const kellogs = WorkersService.getLogs();
    errors = {};

    if (kellogs) {
      if (kellogs.hasOwnProperty('error') && kellogs.error) kellogs.error.map(error => (errors[error.time] = error));
      $scope.logsError = errors;
      $scope.logsInfo = kellogs.info;
      $scope.logsWarning = kellogs.warning;
    }
  }, ConfigService.refresh);
}
module.exports = LogsController;
