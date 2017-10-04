const localStorage = require('localStorage');
function ConfigService () {
  this.refresh = 500;
  this.save = function (object) {
    console.log(object)
    for (var key in object) {
      if (object.hasOwnProperty(key)) { localStorage.setItem(key, JSON.stringify(object[key])); }
    }
  };
  this.get = key => JSON.parse(localStorage.getItem(key));
}

module.exports = ConfigService;
