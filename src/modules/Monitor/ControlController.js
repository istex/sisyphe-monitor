const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const zlib = require('zlib');
const mkdirp = require('mkdirp');
function ControlController ($scope, $interval, WorkersService, ConfigService, NotificationService) {
  $scope.launchCommand = function (command) {
    let commandString = '';
    if (!command || !command.hasOwnProperty('name') || !command.hasOwnProperty('path')) return $scope.commandError = 'Please set a name and a path';
    if (command.hasOwnProperty('config')) commandString += `-c ${command.config} `;
    commandString += `-n ${command.name} ${command.path} -s `;
    $scope.commandError = undefined;
    WorkersService.launchCommand(commandString);
  };
  $scope.getstatus = function () {
    return WorkersService.status;
  };
  $scope.downloadFiles = async _ => {
    let response = await WorkersService.downloadFiles();
    response = JSON.parse(zlib.inflateSync(response).toString('utf8'));
    const { dialog } = require('electron').remote;
    const pathToSave = dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .pop();
    response.map(async file => {
      mkdirp.sync(path.dirname(path.resolve(pathToSave, file.path)));
      await fs.writeFileAsync(path.resolve(pathToSave, file.path), file.content, 'utf8');
    });
    NotificationService.add('info', `Files saves in ${pathToSave}`);
  };
}

module.exports = ControlController;
