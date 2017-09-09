const xxh = require("xxhashjs").h32;

function ModulesController($scope, $interval, Modules) {
  Modules.launch();
  let waitingH;
  $interval(_ => {
    if(waitingH !== xxh(JSON.stringify(Modules.getWaitings()), "aaa").toString(16)) {
      waitingH = xxh(JSON.stringify(Modules.getWaitings()), "aaa").toString(16);
      $scope.waitingModules = Modules.getWaitings();
    }

    $scope.currentModule = Modules.getCurrent();
    $scope.doneModules = Modules.getDones();
    $scope.percent = Modules.getCurrentPercent();
    $scope.totalPercent = Modules.getTotalPercent();
  }, 100);
}

function order(list) {
  return list
}

module.exports = ModulesController;