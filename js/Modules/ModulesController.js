const xxh = require('xxhashjs').h32;

function ModulesController ($scope, $interval, Modules, ConfigService) {
  Modules.launch();
  let waitingH;
  $interval(_ => {
    if (waitingH !== xxh(JSON.stringify(Modules.getWaitings()), 'aaa').toString(16)) {
      waitingH = xxh(JSON.stringify(Modules.getWaitings()), 'aaa').toString(16);
      $scope.waitingModules = Modules.getWaitings();
    }

    $scope.currentModule = Modules.getCurrent();
    $scope.doneModules = Modules.getDones();
    $scope.percent = Modules.getCurrentPercent();
    $scope.totalPercent = Modules.getTotalPercent();
  }, ConfigService.refresh);
}

module.exports = ModulesController;
