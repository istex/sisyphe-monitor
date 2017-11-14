const MonitorController = require('./MonitorController');
const ControlController = require('./ControlController');
const InfoController = require('./InfoController');
const ProgressionController = require('./ProgressionController');
const HintDirective = require('./directives/hint')
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('MonitorController', MonitorController)
    .controller('ControlController', ControlController)
    .controller('ProgressionController', ProgressionController)
    .controller('InfoController', InfoController)
    .config(config)
    .directive('tab', HintDirective);
};
