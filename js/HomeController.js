function HomeController ($scope, $interval, Modules, ConfigService) {
  const host = ConfigService.get("host") || "localhost";
  $scope.Model = { host };
  Modules.changeHost(host);
}
module.exports = HomeController;
