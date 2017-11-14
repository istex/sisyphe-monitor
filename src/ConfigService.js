const localStorage = require("localStorage");
function ConfigService() {
  this.refresh = 500;
  this.save = function(object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        localStorage.setItem(key, JSON.stringify(object[key]));
      }
    }
  };
  this.get = key => JSON.parse(localStorage.getItem(key));
  this.empty = function() {
    localStorage.clear();
    const app = require("electron").remote.getCurrentWindow().reload();
    // setTimeout(_=>{
    //   // const app = require("remote").require("app");
    //   var exec = require("child_process").exec;
    //   exec(process.argv.join("")); // execute the command that was used to run the app
    //   app.quit(); // quit the current app
    // },100)
  };
}

module.exports = ConfigService;
