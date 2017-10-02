const router = require('./router.js');
const config = function config (
  $stateProvider,
  $urlRouterProvider,
  $httpProvider
) {
  router($stateProvider, $urlRouterProvider, $httpProvider);
};
module.exports = config;
