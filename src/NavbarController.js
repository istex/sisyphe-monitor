function NavbarController ($scope, ModuleService) {
  $scope.changeModule = (moduleName) => { ModuleService.changeActiveModule(moduleName); };
}

module.exports = NavbarController;
