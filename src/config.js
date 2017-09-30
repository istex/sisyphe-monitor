const router = require('./router');
const config = function config ($stateProvider, $urlRouterProvider, $httpProvider) {
  router($stateProvider, $urlRouterProvider, $httpProvider);
};
module.exports = config;
