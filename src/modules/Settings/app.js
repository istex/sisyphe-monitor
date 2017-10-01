const SettingsController = require('./SettingsController');
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('SettingsController', SettingsController)
    .config(config);
};
