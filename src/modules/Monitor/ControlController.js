const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

function ControlController ($scope, $interval, WorkersService, ConfigService, NotificationService) {
  $scope.launchCommand = function (command) {
    let commandString = '';
    if (!command || !command.hasOwnProperty('name') || !command.hasOwnProperty('path')) return $scope.commandError = 'Please set a name and a path';
    if (command.hasOwnProperty('config')) commandString += `-c ${command.config} `;
    commandString += `-n ${command.name} ${command.path} -s `;
    $scope.commandError = undefined;
    WorkersService.launchCommand(commandString);
  };
  $scope.getstatus = function(){
    return WorkersService.status
  }
  $scope.downloadFiles = async _ => {
    const response = await WorkersService.downloadFiles();
    const { dialog } = require('electron').remote;
    const pathToSave = dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .pop();
    await fs.writeFileAsync(path.resolve(pathToSave, response.log.file), response.log.content, 'utf8');
    await fs.writeFileAsync(path.resolve(pathToSave, response.xpath.file), response.xpath.content, 'utf8');
    NotificationService.add('info', `Files saves in ${pathToSave}`);
  };
}

module.exports = ControlController;
