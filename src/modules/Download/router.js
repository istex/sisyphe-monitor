function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: 'Download',
    url: '/',
    views: {
      'navbar@Download': {
        parent: 'Download',
        templateUrl: 'views/_navbar.html',
        controller: 'NavbarCtrl'
      },
      'modal@Download': {
        parent: 'Download',
        templateUrl: 'views/_modal.html',
        controller: 'NavbarCtrl'
      },
      'Download@Download': {
        parent: 'Download',
        templateUrl: 'src/modules/Download/Download.html'
      },
      '': {
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'DownloadController'
      }
    }
  });
}
module.exports = Router;
