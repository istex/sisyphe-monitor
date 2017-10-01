function SettingsController ($scope, WorkersService, ConfigService) {
  
  $scope.Settings = 'I\' the module Settings !';
  $scope.settings = {
    host: ConfigService.get('host')
  };
  $scope.redisConnection = _ => WorkersService.redisConnection;
  $scope.changeHost = function (host) {
    WorkersService.changeHost(host);
    ConfigService.save({host});
  };
}
module.exports = SettingsController;
