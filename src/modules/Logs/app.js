const LogsController = require('./LogsController');
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('LogsController', LogsController)
    .config(config);
};
