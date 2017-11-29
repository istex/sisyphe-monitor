function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: 'Monitor',
    url: '/Monitor',
    views: {
      'navbar@Monitor': {
        parent: 'Monitor',
        templateUrl: 'views/_navbar.html',
        controller: 'NavbarCtrl'
      },
      'modal@Monitor': {
        parent: 'Monitor',
        templateUrl: 'views/_modal.html',
        controller: 'ModalController'
      },
      'notifications@Monitor': {
        parent: 'Monitor',
        templateUrl: 'views/_notifications.html',
        controller: 'NotificationController'
      },
      'Monitor@Monitor': {
        parent: 'Monitor',
        templateUrl: 'modules/Monitor/Monitor.html',
        controller: 'MonitorController'
      },
      'control@Monitor': {
        parent: 'home',
        templateUrl: 'modules/Monitor/views/_control.html',
        controller: 'ControlController'
      },
      'infos@Monitor': {
        parent: 'Monitor',
        templateUrl: 'modules/Monitor/views/_infos.html',
        controller: 'InfoController'
      },
      'modules@Monitor': {
        parent: 'Monitor',
        templateUrl: 'modules/Monitor/views/_modules.html',
        controller: 'WorkersController'
      },
      'progression@Monitor': {
        parent: 'Monitor',
        templateUrl: 'modules/Monitor/views/_progression.html',
        controller: 'ProgressionController'
      },
      '': {
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }
    }
  });
}
module.exports = Router;
