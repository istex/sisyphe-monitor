module.exports = {
  name: "home",
  url: "/",
  views: {
    "navbar@home": {
      parent: "home",
      templateUrl: "views/_navbar.html",
      controller: "NavbarCtrl"
    },
    "modal@home": {
      parent: "home",
      templateUrl: "views/_modal.html",
      controller: "NavbarCtrl"
    },
    "notifications@home": {
      parent: "home",
      templateUrl: "views/_notifications.html",
      controller: "NotificationController"
    },
    "infos@home": {
      parent: "home",
      templateUrl: "views/_infos.html",
      controller: "InfoController"
    },
    "modules@home": {
      parent: "home",
      templateUrl: "views/_modules.html",
      controller: "ModulesCtrl"
    },
    "logs@home": {
      parent: "home",
      templateUrl: "views/_logs.html",
      controller: "LogsCtrl"
    },
    "": {
      abstract: true,
      templateUrl: "views/home.html",
      controller: "HomeCtrl"
    }
  }
};
