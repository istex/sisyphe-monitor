function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: "Settings",
    url: "/",
    views: {
      "navbar@Settings": {
        parent: "Settings",
        templateUrl: "views/_navbar.html",
        controller: "NavbarCtrl"
      },
      "modal@Settings": {
        parent: "Settings",
        templateUrl: "views/_modal.html",
        controller: "NavbarCtrl"
      },
      "notifications@Settings": {
        parent: "Settings",
        templateUrl: "views/_notifications.html",
        controller: "NotificationController"
      },
      "Settings@Settings": {
        parent: "Settings",
        templateUrl: "src/modules/Settings/Settings.html"
      },
      "": {
        abstract: true,
        templateUrl: "views/home.html",
        controller: "SettingsController"
      }
    }
  });
}
module.exports = Router;
