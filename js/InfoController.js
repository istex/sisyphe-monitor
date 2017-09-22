function InfoController($scope, $timeout, Modules, ConfigService) {
    $scope.launchCommand= function (command) {
        let commandString = '';
        if (!command || !command.hasOwnProperty("name") || !command.hasOwnProperty("path")) return $scope.commandError = 'Please set a name and a path'
        if (command.hasOwnProperty("config")) commandString += `-c ${command.config} `
        commandString += `-n ${command.name} ${command.path} -s `
        $scope.commandError = undefined;
        Modules.launchCommand(commandString)
    }
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
