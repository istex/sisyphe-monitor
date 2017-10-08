function NavbarController ($scope, ModuleService) {
  $scope.changeModule = (moduleName) => { ModuleService.changeActiveModule(moduleName); };
  $scope.activeModule = _ => ModuleService.activeModule;
}

module.exports = NavbarController;
