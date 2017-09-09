const HomeController = require("./js/HomeController");
const ModuleService = require("./js/Modules/ModuleService");
const ModulesController = require("./js/Modules/ModulesController");
const LogsController = require("./js/Logs/LogsController");
const NavbarController = require("./js/NavbarController");
const constant = require("./js/constant");
const config = require('./js/config')
let app = angular
  .module("sisyphe", ["ngResource", "ui.router"])
  .constant("contant", constant)
  .service("Modules", ModuleService)
  .controller("LogsCtrl", LogsController)
  .controller("ModulesCtrl", ModulesController)
  .controller("NavbarCtrl", NavbarController)
  .config(config);