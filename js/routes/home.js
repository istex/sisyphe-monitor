module.exports = {
  name: "home",
  url: "/",
  views: {
    "navbar@home": {
      templateUrl: "views/_navbar.html",
      controller: "NavbarCtrl"
    },
    "modules@home": {
      templateUrl: "views/_modules.html",
      controller: "ModulesCtrl"
    },
    "logs@home": {
      templateUrl: "views/_logs.html",
      controller: "LogsCtrl"
    },
    "": {
      templateUrl: "views/home.html",
      controller: "HomeCtrl"
    }
  }
};
