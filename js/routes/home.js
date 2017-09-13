module.exports = {
  name: 'home',
  url: '/',
  views: {
    'navbar@home': {
      parent: 'home',
      templateUrl: 'views/_navbar.html',
      controller: 'NavbarCtrl'
    },
    'modal@home': {
      parent: 'home',
      templateUrl: 'views/_modal.html'
    },
    'infos@home': {
      parent: 'home',
      templateUrl: 'views/_infos.html'
    },
    'modules@home': {
      parent: 'home',
      templateUrl: 'views/_modules.html',
      controller: 'ModulesCtrl'
    },
    'logs@home': {
      parent: 'home',
      templateUrl: 'views/_logs.html',
      controller: 'LogsCtrl'
    },
    '': {
      abstract: true,
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }
  }
};
