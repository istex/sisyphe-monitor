const DownloadService = require('./DownloadService');
const config = require('./config');
const DownloadController = require('./DownloadController');

module.exports.init = function (angular) {
  angular
    .service('DownloadService', DownloadService)
    .controller('DownloadController', DownloadController)
    .config(config);
};
