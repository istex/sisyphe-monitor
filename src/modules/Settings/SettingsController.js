function SettingsController ($scope, WorkersService, ConfigService) {
  $scope.settings = {
    host: ConfigService.get('host'),
    workers: ConfigService.get('workers')
  };
  $scope.redisConnection = _ => WorkersService.redisConnection;
  $scope.changeHost = function (host) {
    WorkersService.changeHost(host);
    const serverUrl = `http://${host}:3264/`
    ConfigService.save({host, serverUrl});
  };
}
module.exports = SettingsController;
