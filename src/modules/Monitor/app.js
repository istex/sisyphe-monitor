const MonitorController = require('./MonitorController');
const ControlController = require('./ControlController');
const InfoController = require('./InfoController');
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('MonitorController', MonitorController)
    .controller('ControlController', ControlController)
    .controller('InfoController', InfoController)
    .config(config);
};
