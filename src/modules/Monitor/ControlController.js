const request = require('request-promise');
function ControlController ($scope, $interval, $state, WorkersService, ConfigService, NotificationService, DownloadService) {
  $scope.launchCommand = async function (command) {
    let commandString = '';
    if (!command || !command.hasOwnProperty('name') || !command.hasOwnProperty('path')) return ($scope.commandError = 'Please set a name and a path');
    if (command.hasOwnProperty('config')) commandString += `-c ${command.config} `;
    $scope.commandError = undefined;
    const workers = ConfigService.get('workers');
    let removeString = '';
    workers
    .filter(worker => worker.disable)
    .map(
      workerDisabled => (removeString += `-r ${workerDisabled.name} `)
    );
    commandString += removeString;
    commandString += `-n ${command.name} ${command.path} -s`;
    const url = ConfigService.get('serverUrl') + 'launch';
    var options = { method: 'POST', url, body: { command: commandString }, json: true };
    await request(options);
  };
  $scope.stop = async function () {
    const url = ConfigService.get('serverUrl') + 'stop';
    var options = { method: 'POST', url };
    await request(options);
  };
  $scope.getstatus = _ => WorkersService.status;
  $scope.downloadFiles = async _ => {
    const url = ConfigService.get('serverUrl') + 'download/latest';
    let latestSession = await request(url);
    $scope.downloadError = undefined;
    const { dialog } = require('electron').remote;
    let pathToSave = dialog
      .showOpenDialog({ properties: ['openDirectory'] });
    if (!pathToSave) return ($scope.downloadError = 'No path specified');
    pathToSave = pathToSave.pop();
    console.log(pathToSave);
    latestSession = JSON.parse(latestSession);
    latestSession.map(fileOnServer => {
      DownloadService.add(fileOnServer.path, pathToSave);
    });
    $state.go('Download');
    DownloadService.launch();
  };

  $scope.readdirServer = async function (path) {
    const url = ConfigService.get('serverUrl') + 'readdir';
    var options = { method: 'POST', url, body: { path }, json: true };
    const readdir = await request(options);
    return readdir;
  };
}

module.exports = ControlController;
