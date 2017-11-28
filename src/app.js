const ConfigService = require('./src/ConfigService');
const ModuleService = require('./src/ModuleService');
const WorkersService = require('./src/Workers/WorkersService');
const ConnectionService = require('./src/ConnectionService');
const NotificationService = require('./src/NotificationService');
const ModalService = require('./src/Modal/ModalService');

const HomeController = require('./src/HomeController');
const NavbarController = require('./src/NavbarController');
const NotificationController = require('./src/NotificationController');
const WorkersController = require('./src/Workers/WorkersController');
const ModalController = require('./src/Modal/ModalController');

const config = require('./src/config');
const ang = angular
  .module('app', ['ui.router', 'ui.sortable'])
  .service('ConfigService', ConfigService)
  .service('ModuleService', ModuleService)
  .service('ModalService', ModalService)
  .service('NotificationService', NotificationService)
  .service('WorkersService', WorkersService)
  .service('ConnectionService', ConnectionService)
  .controller('HomeCtrl', HomeController)
  .controller('NavbarCtrl', NavbarController)
  .controller('NotificationController', NotificationController)
  .controller('WorkersController', WorkersController)
  .controller('ModalController', ModalController)
  .config(config)
  .run([
    '$rootScope',
    '$state',
    function ($rootScope, $state) {
      $rootScope.$state = $state;
      console.log("ON PASSE")
      setTimeout(function (argument) {
        // body...
        $state.go('Monitor');
      },1000)
    }
  ]); 

setInterval(function (argument) {
  // body...
  console.log(window.location);
},3000)


const Monitor = require('./src/modules/Monitor/app'); Monitor.init(ang);
const Logs = require('./src/modules/Logs/app'); Logs.init(ang);
const Settings = require('./src/modules/Settings/app'); Settings.init(ang);
const Download = require('./src/modules/Download/app'); Download.init(ang);
const Version = require('./src/modules/Version/app');Version.init(ang); 
