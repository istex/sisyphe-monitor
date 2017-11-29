const localStorage = require('localStorage');
function ConfigService () {
  this.refresh = 500;
  this.save = function (object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        localStorage.setItem(key, JSON.stringify(object[key]));
      }
    }
  };
  this.get = key => JSON.parse(localStorage.getItem(key));
  this.empty = function () {
    localStorage.clear();
  };
}

module.exports = ConfigService;
