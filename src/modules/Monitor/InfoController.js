function InfoController ($scope, $interval, WorkersService, ConfigService, NotificationService) {
  $interval(_ => {
    $scope.maxFile = WorkersService.maxFile;
    $scope.time = WorkersService.time;
    $scope.corpusname = WorkersService.monitoring.corpusname;
    $scope.status = WorkersService.status;
  }, ConfigService.refresh);
}

module.exports = InfoController;
