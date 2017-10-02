function SettingsController ($scope, WorkersService, ConfigService) {
  $scope.Settings = 'I\' the module Settings !';
  $scope.settings = {
    host: ConfigService.get('host')
  };
  $scope.redisConnection = _ => WorkersService.redisConnection;
  $scope.changeHost = function (host) {
    WorkersService.changeHost(host);
    const serverUrl = `http://${host}:3000/`
    ConfigService.save({host, serverUrl});
  };
}
module.exports = SettingsController;
