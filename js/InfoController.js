function InfoController($scope, $timeout, Modules, ConfigService) {
    loop($scope, $timeout, Modules, ConfigService);
}

function loop($scope, $timeout, Modules, ConfigService) {
    $timeout(_=>{
        $scope.maxFile = Modules.maxFile;
        $scope.time = Modules.getTime();
        $scope.status = Modules.getStatus();
        loop($scope, $timeout, Modules, ConfigService);
    }, ConfigService.refresh)
}
module.exports = InfoController;
