const localStorage = require('localStorage')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
function ConfigService () {
  this.refresh = 500;
  this.save = function(object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) localStorage.setItem(key, JSON.stringify(object[key]));
    }
  }
  this.get = (key) => JSON.parse(localStorage.getItem(key))
}

module.exports = ConfigService;
