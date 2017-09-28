function InfoController($scope, $interval, Modules, ConfigService) {
    $scope.launchCommand= function (command) {
        let commandString = '';
        if (!command || !command.hasOwnProperty("name") || !command.hasOwnProperty("path")) return $scope.commandError = 'Please set a name and a path'
        if (command.hasOwnProperty("config")) commandString += `-c ${command.config} `
        commandString += `-n ${command.name} ${command.path} -s `
        $scope.commandError = undefined;
        Modules.launchCommand(commandString)
    }
    $scope.downloadFiles = _=> Modules.downloadFiles ()
    $interval(_=>{
        $scope.maxFile = Modules.maxFile;
        $scope.time = Modules.getTime();
        $scope.status = Modules.getStatus();
    }, ConfigService.refresh)
}

module.exports = InfoController;
