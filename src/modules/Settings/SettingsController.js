function SettingsController ($scope, $interval, $timeout, WorkersService, ConfigService, ModuleService) {
  $scope.activeModule = ModuleService.changeActiveModule('Settings');
  $scope.settings = {
    host: ConfigService.get('host'),
    workers: getWorkers(),
    bundle: ConfigService.get('bundle')
  };
  $scope.updateOrder = function(data) {
    console.log($scope.settings)
    $timeout(_=>{
      ConfigService.save($scope.settings);
    },100)
  };
  const workersInterval = $interval(_=>{
    if (!$scope.settings.workers) $scope.settings.workers = getWorkers()
    else return clearInterval(workersInterval)
  },ConfigService.refresh)
  $scope.saveSettings = _ => ConfigService.save($scope.settings);
  $scope.debugSisyphe = debug => ConfigService.save({debug});
  // $scope.redisConnection = _ => WorkersService.redisConnection;
  $scope.debug = _ => ConfigService.get('debug')
  $scope.changeHost = function (host) {
    WorkersService.changeHost(host);
    const serverUrl = `http://${host}:3264/`;
    ConfigService.save({host, serverUrl});
  };
  $scope.resync = function() {
    ConfigService.empty()
  };
  function getWorkers() {
    const workers = ConfigService.get("workers") || [];
    return workers.filter(worker => worker.name !== "walker-fs")
  }
}
module.exports = SettingsController;
