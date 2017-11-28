const VersionController = require('./VersionController');
const VersionService = require('./VersionService')
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('VersionController', VersionController)
    .service('VersionService', VersionService)
    .config(config);
};
