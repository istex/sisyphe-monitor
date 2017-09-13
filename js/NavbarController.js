function NavbarController ($scope, $interval, Modules, ConfigService) {
  $interval(_ => {
    $scope.totalPercent = Modules.getTotalPercent();
  }, ConfigService.refresh);
}

module.exports = NavbarController;
