const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const zlib = require('zlib');
const mkdirp = require('mkdirp');
const request = require('request-promise')  
function ControlController ($scope, $interval, $state, WorkersService, ConfigService, NotificationService, DownloadService) {
  $scope.launchCommand = async function (command) {
    let commandString = "";
    if (!command || !command.hasOwnProperty("name") || !command.hasOwnProperty("path")) return ($scope.commandError = "Please set a name and a path");
    if (command.hasOwnProperty("config")) commandString += `-c ${command.config} `;
    $scope.commandError = undefined;
    const workers = ConfigService.get('workers')
    let removeString = ""
    workers
    .filter(worker => worker.disable)
    .map(
      workerDisabled => (removeString += `-r ${workerDisabled.name} `)
    );
    commandString += removeString
    commandString += `-n ${command.name} ${command.path} -s `;
    const url = ConfigService.get("serverUrl") + "launch";
    var options = { method: "POST", url, body: { command: commandString }, json: true }; // Automatically stringifies the body to JSON
    let latestSession = await request(options)
  };
  $scope.getstatus = function () {
    return WorkersService.status;
  };
  $scope.downloadFiles = async _ => {
    const url = ConfigService.get("serverUrl") + "download/latest";
    let latestSession = await request(url)
    $scope.downloadError = undefined;
    const { dialog } = require("electron").remote;
    let pathToSave = dialog
      .showOpenDialog({ properties: ["openDirectory"] })
    if (!pathToSave) return ($scope.downloadError = "No path specified");
    pathToSave = pathToSave.pop()
    console.log(pathToSave);
    latestSession = JSON.parse(latestSession)
    latestSession.map(fileOnServer=>{
      DownloadService.add(fileOnServer.path, pathToSave)
    })
    $state.go('Download')
    DownloadService.launch()
  };

  $scope.readdirServer = async function(path) {
    const url = ConfigService.get("serverUrl") + "readdir";
    var options = { method: "POST", url, body: { path }, json: true }; // Automatically stringifies the body to JSON
    return await request(options)
  };
}

module.exports = ControlController;
