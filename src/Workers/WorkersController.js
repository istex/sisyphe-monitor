function WorkersController ($scope, $interval, WorkersService, ConfigService, ModalService, $state, NotificationService) {
  $scope.currentPercent = function(){
    return WorkersService.percents.percent;
  }
  $scope.modules = WorkersService.modules;
  $interval(_ => {
    if (WorkersService.redisConnection === false) {
      NotificationService.add('error', 'Connection lost: please, verify url of redis');
      $state.go('Settings');
    }
  }, 500);
}

module.exports = WorkersController;
