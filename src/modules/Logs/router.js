function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: 'Logs',
    url: '/',
    views: {
      'navbar@Logs': {
        parent: 'Logs',
        templateUrl: 'views/_navbar.html',
        controller: 'NavbarCtrl'
      },
      'modal@Logs': {
        parent: 'Logs',
        templateUrl: 'views/_modal.html',
        controller: 'NavbarCtrl'
      },
      'Logs@Logs': {
        parent: 'Logs',
        templateUrl: 'src/modules/Logs/Logs.html'
      },
      '': {
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'LogsController'
      }
    }
  });
}
module.exports = Router;
