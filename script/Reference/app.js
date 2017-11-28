const {{Controller}} = require('./{{Controller}}');
const config = require('./config');

module.exports.init = function (angular) {
  angular
    .controller('{{Controller}}', {{Controller}})
    .config(config);
};
