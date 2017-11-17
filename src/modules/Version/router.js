function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: "Version",
    url: "/Version",
    views: {
      "navbar@Version": {
        parent: "Version",
        templateUrl: "views/_navbar.html",
        controller: "NavbarCtrl"
      },
      "modal@Version": {
        parent: "Version",
        templateUrl: "views/_modal.html",
        controller: "NavbarCtrl"
      },
      "Version@Version": {
        parent: "Version",
        templateUrl: "src/modules/Version/Version.html",
        controller: "HomeCtrl"
      },
      "notifications@Version": {
        parent: "Version",
        templateUrl: "views/_notifications.html",
        controller: "NotificationController"
      },
      "": {
        abstract: true,
        templateUrl: "views/home.html",
        controller: "VersionController"
      }
    }
  });
}
module.exports = Router;
