function ModulesController ($scope, $interval, WorkersService, ConfigService, ModalService) {
  $scope.modules = WorkersService.modules;
  $scope.percents = WorkersService.percents;
}

module.exports = ModulesController;
