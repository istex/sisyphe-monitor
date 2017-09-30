function LogsController ($scope, $timeout, $interval, WorkersService, ConfigService) {
  let errors = {};
  const kellogs = WorkersService.getLogs();
  errors = {};

  if (kellogs) {
    if (kellogs.hasOwnProperty('error') && kellogs.error) kellogs.error.map(error => (errors[error.time] = error));
    $scope.logsError = errors;
    $scope.logsInfo = kellogs.info;
    $scope.logsWarning = kellogs.warning;
  }

  $timeout(_ => {
    LogsController($scope, $timeout, $interval, WorkersService, ConfigService);
  }, ConfigService.refresh);
}
module.exports = LogsController;
