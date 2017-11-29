const ConfigService = require('./ConfigService');
const ModuleService = require('./ModuleService');
const WorkersService = require('./Workers/WorkersService');
const ConnectionService = require('./ConnectionService');
const NotificationService = require('./NotificationService');
const ModalService = require('./Modal/ModalService');

const HomeController = require('./HomeController');
const NavbarController = require('./NavbarController');
const NotificationController = require('./NotificationController');
const WorkersController = require('./Workers/WorkersController');
const ModalController = require('./Modal/ModalController');

const config = require('./config');
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
      setTimeout(function (argument) {
        // body...
        $state.go('Monitor');
      }, 1000);
    }
  ]);

const Monitor = require('./modules/Monitor/app'); Monitor.init(ang);
const Logs = require('./modules/Logs/app'); Logs.init(ang);
const Settings = require('./modules/Settings/app'); Settings.init(ang);
const Download = require('./modules/Download/app'); Download.init(ang);
const Version = require('./modules/Version/app'); Version.init(ang);
