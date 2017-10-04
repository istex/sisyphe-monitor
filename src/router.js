
function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/Monitor');
  $stateProvider.state(require('./routes/home'));
}

module.exports = Router;
