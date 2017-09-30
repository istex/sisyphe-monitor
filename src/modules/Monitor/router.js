function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: 'Monitor',
    url: '/',
    views: {
      'navbar@Monitor': {
        parent: 'Monitor',
        templateUrl: 'views/_navbar.html',
        controller: 'NavbarCtrl'
      },
      'modal@Monitor': {
        parent: 'Monitor',
        templateUrl: 'views/_modal.html',
        controller: 'NavbarCtrl'
      },
      'Monitor@Monitor': {
        parent: 'Monitor',
        templateUrl: 'src/modules/Monitor/Monitor.html'
      },
      'control@Monitor': {
        parent: 'Monitor',
        templateUrl: 'src/modules/Monitor/views/_control.html',
        controller: 'ControlController'
      },
      'infos@Monitor': {
        parent: 'Monitor',
        templateUrl: 'src/modules/Monitor/views/_infos.html',
        controller: 'InfoController'
      },
      'modules@Monitor': {
        parent: 'Monitor',
        templateUrl: 'src/modules/Monitor/views/_modules.html',
        controller: 'WorkersController'
      },
      'progression@Monitor': {
        parent: 'Monitor',
        templateUrl: 'src/modules/Monitor/views/_progression.html',
        controller: 'WorkersController'
      },
      '': {
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'MonitorController'
      }
    }
  });
}
module.exports = Router;
