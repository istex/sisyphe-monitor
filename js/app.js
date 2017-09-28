const ModuleService = require('./js/Modules/ModuleService');
const ConfigService = require('./js/ConfigService');
const NotificationService = require('./js/NotificationService');
const ModulesController = require('./js/Modules/ModulesController');
const HomeController = require("./js/HomeController");
const NotificationController = require("./js/NotificationController");
const LogsController = require('./js/Logs/LogsController');
const NavbarController = require('./js/NavbarController');
const InfoController = require('./js/InfoController');
const config = require('./js/config');
angular
  .module("sisyphe", ["ui.router"])
  .service("Modules", ModuleService)
  .service("ConfigService", ConfigService)
  .service("NotificationService", NotificationService)
  .controller("HomeCtrl", HomeController)
  .controller("NotificationController", NotificationController)
  .controller("LogsCtrl", LogsController)
  .controller("ModulesCtrl", ModulesController)
  .controller("NavbarCtrl", NavbarController)
  .controller("InfoController", InfoController)
  .config(config);
