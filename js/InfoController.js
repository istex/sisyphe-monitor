const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function InfoController ($scope, $interval, Modules, ConfigService, NotificationService) {
  $scope.launchCommand = function (command) {
    let commandString = '';
    if (!command || !command.hasOwnProperty('name') || !command.hasOwnProperty('path')) return $scope.commandError = 'Please set a name and a path';
    if (command.hasOwnProperty('config')) commandString += `-c ${command.config} `;
    commandString += `-n ${command.name} ${command.path} -s `;
    $scope.commandError = undefined;
    Modules.launchCommand(commandString);
  };
  $scope.downloadFiles = async _ => {
    const response = await Modules.downloadFiles();
    const { dialog } = require('electron').remote;
    const pathToSave = dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .pop();
    await fs.writeFileAsync(path.resolve(pathToSave, response.log.file), response.log.content, 'utf8');
    await fs.writeFileAsync(path.resolve(pathToSave, response.xpath.file), response.xpath.content, 'utf8');
    NotificationService.add('info', `Files saves in ${pathToSave}`);
  };
  $interval(_ => {
    $scope.maxFile = Modules.maxFile;
    $scope.time = Modules.getTime();
    $scope.status = Modules.getStatus();
  }, ConfigService.refresh);
}

module.exports = InfoController;
