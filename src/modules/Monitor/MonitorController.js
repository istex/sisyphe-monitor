function MonitorController ($scope, $interval, WorkersService, ConfigService, $state) {
  const host = ConfigService.get('host') || 'localhost';
  $scope.Model = { host };
  WorkersService.changeHost(host);
}
module.exports = MonitorController;
