const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const zlib = require('zlib');
const mkdirp = require('mkdirp');
const request = require('request-promise')
function ControlController ($scope, $interval, $state, WorkersService, ConfigService, NotificationService, DownloadService) {
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
    const url = ConfigService.get("serverUrl") + "download/latest";
    console.log(url)
    let latestSession = await request(url)
    latestSession = JSON.parse(latestSession)
    console.log('latestSession', latestSession)
    latestSession.map(file=>{
      DownloadService.add(file.path)
    })
    $state.go('Download')
    DownloadService.launch()
    // DownloadService.launch()
    
    // let response = await WorkersService.downloadFiles();
    // response = JSON.parse(zlib.inflateSync(response).toString('utf8'));
    // const { dialog } = require('electron').remote;
    // const pathToSave = dialog
    //   .showOpenDialog({ properties: ['openDirectory'] })
    //   .pop();
    // response.map(async file => {
    //   mkdirp.sync(path.dirname(path.resolve(pathToSave, file.path)));
    //   await fs.writeFileAsync(path.resolve(pathToSave, file.path), file.content, 'utf8');
    // });
    // NotificationService.add('info', `Files saves in ${pathToSave}`);
  };
}

module.exports = ControlController;
