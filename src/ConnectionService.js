const request = require("request-promise");
const Promise = require("bluebird");

function ConnectionService($http, $q, $timeout, $interval, ConfigService, WorkersService) {
  ConnectionService.$inject.map((dependency, index) => (this[dependency] = arguments[index]));
  this.data = {
    serverConnection: false,
    redisConnection: false
  }
  $interval(_=>{
    this.checkServerConnection().catch(err=>{})
    this.data.redisConnection = WorkersService.redisConnection
  }, ConfigService.refresh)
  this.checkServerConnection = function() {
    const url = ConfigService.get("serverUrl") + "ping";
    return request.get(url)
      .then(response => {
        if (response === 'pong') this.data.serverConnection = true;
        else this.data.serverConnection = false;
      })
      .catch(err=>{this.data.serverConnection = false;});
  };
}

module.exports = ConnectionService;
