function HomeController ($scope, $interval, Modules, ConfigService) {
  $scope.changeHost = function (host) {
    Modules.changeHost(host);
  };
  $scope.Model = {
    host: Modules.host
  };
  $interval(_ => {
    console.log(Modules.isRunning());
    if (!Modules.isRunning()) {
      $scope.triggerModal = true;
      $scope.modalHeader = 'Error';
      $scope.modalContainer = 'Redis is not runnning...';
    } else $scope.triggerModal = false;
  }, ConfigService.refresh);
}
module.exports = HomeController;
