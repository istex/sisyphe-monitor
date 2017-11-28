const rp = require("request-promise");
function VersionController($scope, $interval, ConfigService, VersionService, ModuleService) {
  $scope.activeModule = ModuleService.changeActiveModule("Version");
  $scope.sisyphe = {};
  $scope.git = {
    status: -10
  };
  $interval(async _ => {
    const branchesInfo = await VersionService.branches().catch(err => {
      console.log(err);
    });
    $scope.git.localBranchesName = branchesInfo.localBranchesName;
    $scope.git.currentBranchName = branchesInfo.currentBranchName;
    $scope.git.remoteBranchesName = branchesInfo.remoteBranchesName;
    $scope.sisyphe.versions = await VersionService.sisypheVersions().catch(
      err => {
        console.log(err);
      }
    );
  }, ConfigService.refresh);
  $scope.changeBranch = async function(branch) {
    $scope.git.status = undefined;
    $scope.loading = true
    VersionService.changeBranch(branch)
      .then(_ => {
        $scope.git.currentBranchName = branch;
        VersionService.status()
          .then(status => {
            $scope.git.status = status;
            $scope.loading = false;
          })
          .catch(err => console.log(err));
      })
      .catch(err => {
        console.log(err);
      });
  };

  $scope.pull = function(branch) {
    $scope.loading = true;
    VersionService.pull(branch)
      .then(status => {
        $scope.loading = false;
        $scope.git.status = status ? 0 : -1;
      })
      .catch(err => console.log(err));
  };

  VersionService.status()
    .then(status => {
      $scope.git.status = status;
    })
    .catch(err => console.log(err));
}
module.exports = VersionController;
