function ModulesController ($scope, $interval, WorkersService, ConfigService) {
  console.log(WorkersService);
  $scope.modules = WorkersService.modules;
  $scope.percents = WorkersService.percents;
}

module.exports = ModulesController;
