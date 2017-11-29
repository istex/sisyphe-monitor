function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: "Download",
    url: "/Download",
    views: {
      "navbar@Download": {
        parent: "Download",
        templateUrl: "views/_navbar.html",
        controller: "NavbarCtrl"
      },
      "modal@Download": {
        parent: "Download",
        templateUrl: "views/_modal.html",
        controller: "NavbarCtrl"
      },
      "Download@Download": {
        parent: "Download",
        templateUrl: "modules/Download/Download.html",
        controller: "DownloadController"
      },
      "notifications@Download": {
        parent: "Download",
        templateUrl: "views/_notifications.html",
        controller: "NotificationController"
      },
      "": {
        abstract: true,
        templateUrl: "views/home.html",
        controller: "HomeCtrl"
      }
    }
  });
}
module.exports = Router;
