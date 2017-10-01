function ModulesController ($scope, $interval, WorkersService, ConfigService, ModalService, $state, NotificationService) {
  $scope.modules = WorkersService.modules;
  $scope.percents = WorkersService.percents;
  $interval(_=>{
    if (WorkersService.redisConnection === false) {
      NotificationService.add('error', 'Connection lost: please, verify url of redis');
      $state.go("Settings");
    }
  }, 500)
}

module.exports = ModulesController;
