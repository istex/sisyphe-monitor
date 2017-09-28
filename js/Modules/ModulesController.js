function ModulesController ($scope, $interval, Modules, ConfigService) {
  $scope.modules = Modules.modules
  $scope.percents = Modules.percents
}

module.exports = ModulesController;
