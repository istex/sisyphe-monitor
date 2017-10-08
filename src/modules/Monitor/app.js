const MonitorController = require('./MonitorController');
const ControlController = require('./ControlController');
const InfoController = require('./InfoController');
const ProgressionController = require('./ProgressionController');
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('MonitorController', MonitorController)
    .controller('ControlController', ControlController)
    .controller('ProgressionController', ProgressionController)
    .controller('InfoController', InfoController)
    .config(config)
    .directive('tab', function () {
      return function (scope, element, attrs) {
        element.bind('focusout', async function (key) {
          scope.hintInput = '';
        });
        element.bind('keypress', async function (key) {
          let value = element[0].value;
          if (key.keyCode === 13) {
            value = value.split('/');
            value.pop();
            value = value.join('/') + '/';
            if (!value) value = '/';
            const string = value + scope.hintInput[0] + '/';
            scope.launch.path = string;
            scope.hintInput = await scope.readdirServer(string);
          }
        });

        scope.$watch(attrs.ngModel, async function (value) {
          if (!value) return;
          if (value.charAt(value.length - 1) === '/') {
            scope.hintInput = await scope.readdirServer(element[0].value);
          } else {
            const inputfile = value.split('/').pop();
            let newHintInput = scope.hintInput.filter(hint => {
              return hint.includes(inputfile);
            });
            scope.hintInput = newHintInput;
          }
        });
      };
    });
};
