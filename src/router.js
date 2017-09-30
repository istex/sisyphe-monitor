
function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state(require('./routes/home'));
}

module.exports = Router;
