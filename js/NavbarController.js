function NavbarController ($scope, $interval, Modules, ConfigService) {
  $scope.changeHost = function(host) {
    ConfigService.save({host})
    Modules.changeHost(host);
  };
  $interval(_ => {
    if (!Modules.isRunning()) {
      $scope.triggerModal = true;
      $scope.modalHeader = "Error";
      $scope.modalContainer = "Redis is not runnning...";
    } else $scope.triggerModal = false;
  }, ConfigService.refresh);
}

module.exports = NavbarController;
