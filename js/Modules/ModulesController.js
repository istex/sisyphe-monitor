function ModulesController ($scope, $timeout, Modules, ConfigService) {
  $scope.maxFile = 0;
  $scope.listWorkers = [];
  $scope.logs = {};
  $scope.maxFile = 0;
  $scope.waitingModules = {};
  $scope.percent = 0;
  this.loop($scope, $timeout, Modules, ConfigService);
}

ModulesController.prototype.loop = async function($scope, $timeout, Modules, ConfigService) {
  doneModules = [];
  currentModule = {};
  waitingModules = [];
  monitoring = await Modules.getMonitoring();
  if (!monitoring.hasOwnProperty("workers")) return;
  let workers = [];
  for (var i = 0; i < monitoring.workers.length; i++) {
    workers.push(await Modules.getJobsFrom(monitoring.workers[i]));
  }
  workers.forEach(function(worker, index) {
    if ($scope.maxFile < worker.max) {
      $scope.maxFile = worker.max;
      Modules.maxFile = worker.max
    }
    if (worker.wait === 0 && worker.max === 0) waitingModules.push(worker);
    else if (worker.wait === 0 && worker.max !== 0) doneModules.push(worker);
    else {
      const workerBefore = workers[monitoring.workers.indexOf(worker.name) - 1];
      if (workerBefore && worker.wait > workerBefore.wait) {
        currentModule = {
          name: worker.name,
          waiting: worker.waiting,
          wait: $scope.maxFile - worker.waiting
        };
      } else {
        waitingModules.push(worker);
      }
    }
  });

  $scope.percent = percentage(currentModule.waiting, $scope.maxFile);
  $scope.modules = workers;
  $scope.waitingModules = waitingModules;
  $scope.doneModules = doneModules;
  $scope.currentModule = currentModule;
  let allDone = $scope.maxFile * $scope.doneModules.length;
  if ($scope.currentModule.waiting)
    allDone += $scope.maxFile - $scope.currentModule.wait;
  $scope.totalPercent = ~~(allDone * 100 / ($scope.maxFile * workers.length));
  $timeout(_=>{
    this.loop($scope, $timeout, Modules, ConfigService);
  }, ConfigService.refresh)
};

function percentage (nb, total) {
  const percent = (nb * 100) / total;
  if (!percent) return 0;
  else return percent.toFixed(1);
}
module.exports = ModulesController;
