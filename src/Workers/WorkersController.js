function WorkersController ($scope, $interval, WorkersService, ConfigService, ModalService, $state, NotificationService) {
  $scope.currentPercent = function () {
    return WorkersService.percents.percent;
  };
  $scope.modules = WorkersService.modules;
  let redisConnection = 0;
  $interval(_ => {
    if (WorkersService.redisConnection === false) {
      if (redisConnection === 10) {
        NotificationService.add('error', 'Connection lost: please, verify url of redis');
        $state.go('Settings');
      } else {
        redisConnection++;
      }
    } else {
      redisConnection = 0;
    }
  }, 100);
}

module.exports = WorkersController;
