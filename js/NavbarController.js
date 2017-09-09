function NavbarController($scope, $interval, Modules) {
  $interval(_ => {
    $scope.totalPercent = Modules.getTotalPercent();
  }, 100);
}

module.exports = NavbarController;