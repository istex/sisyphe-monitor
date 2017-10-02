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
    commandString += `-n ${command.name} ${command.path} -s `;
    $scope.commandError = undefined;
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
    latestSession = JSON.parse(latestSession)
    latestSession.map(file=>{
      DownloadService.add(file.path)
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
