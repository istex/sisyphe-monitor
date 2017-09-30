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
      templateUrl: 'views/_modal.html',
      controller: 'NavbarCtrl'
    },
    '': {
      abstract: true,
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }
  }
};
