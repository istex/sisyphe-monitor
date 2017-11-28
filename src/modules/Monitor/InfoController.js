function InfoController ($scope, $interval, WorkersService, ConfigService, NotificationService) {
  let corpusname = 'No corpusname';
  $interval(_ => {
    $scope.maxFile = WorkersService.maxFile;
    $scope.time = WorkersService.time;
    corpusname = WorkersService.monitoring.corpusname || corpusname;
    $scope.corpusname = corpusname;
    $scope.status = WorkersService.status;
  }, ConfigService.refresh);
}

module.exports = InfoController;
