function Router ($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state({
    name: "Logs",
    url: "/Logs",
    views: {
      "navbar@Logs": {
        parent: "Logs",
        templateUrl: "views/_navbar.html",
        controller: "NavbarCtrl"
      },
      "modal@Logs": {
        parent: "Logs",
        templateUrl: "views/_modal.html",
        controller: "ModalController"
      },
      "Logs@Logs": {
        parent: "Logs",
        templateUrl: "src/modules/Logs/Logs.html",
        controller: "LogsController"
      },
      "notifications@Logs": {
        parent: "Logs",
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
