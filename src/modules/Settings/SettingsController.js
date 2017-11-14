function SettingsController ($scope, $interval, WorkersService, ConfigService, ModuleService) {
  $scope.activeModule = ModuleService.changeActiveModule('Settings');
  $scope.settings = {
    host: ConfigService.get('host'),
    workers: ConfigService.get('workers')
  };
  const workersInterval = $interval(_=>{
    if (!$scope.settings.workers) $scope.settings.workers = ConfigService.get('workers')
    else return clearInterval(workersInterval)
  },ConfigService.refresh)
  $scope.saveSettings = _ => ConfigService.save($scope.settings);
  $scope.debugSisyphe = debug => ConfigService.save({debug});
  $scope.redisConnection = _ => WorkersService.redisConnection;
  $scope.debug = _ => ConfigService.get('debug')
  $scope.changeHost = function (host) {
    WorkersService.changeHost(host);
    const serverUrl = `http://${host}:3264/`;
    ConfigService.save({host, serverUrl});
  };
  $scope.resync = function() {
    ConfigService.empty()
  };
}
module.exports = SettingsController;
