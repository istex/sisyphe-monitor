function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: '{{ModuleName}}',
    url: '/',
    views: {
      'navbar@{{ModuleName}}': {
        parent: '{{ModuleName}}',
        templateUrl: 'views/_navbar.html',
        controller: 'NavbarCtrl'
      },
      'modal@{{ModuleName}}': {
        parent: '{{ModuleName}}',
        templateUrl: 'views/_modal.html',
        controller: 'NavbarCtrl'
      },
      '{{ModuleName}}@{{ModuleName}}': {
        parent: '{{ModuleName}}',
        templateUrl: 'src/modules/{{ModuleName}}/{{ModuleName}}.html'
      },
      '': {
        abstract: true,
        templateUrl: 'views/home.html',
        controller: '{{Controller}}'
      }
    }
  });
}
module.exports = Router;
