function HomeController ($scope, $interval, Modules, ConfigService) {
  $scope.Model = { host: Modules.host };
}
module.exports = HomeController;
