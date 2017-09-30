function HomeController ($scope, ModuleService, $state) {
  $scope.activeModule = _ => ModuleService.activeModule;
  $state.go('Monitor');
}
module.exports = HomeController;
