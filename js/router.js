const home = require('./routes/home');
function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state(home);
}

module.exports = Router;
