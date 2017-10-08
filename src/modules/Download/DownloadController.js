function DownloadController ($scope, ConfigService, DownloadService, ModuleService) {
  $scope.activeModule = ModuleService.changeActiveModule('Download');
  $scope.launch = function () {
    DownloadService.launch();
  };
  setInterval(_ => {
    $scope.endDownloads = DownloadService.endDownloads;
    $scope.currentDownloads = DownloadService.currentDownloads;
  }, 100);
  $scope.infos = DownloadService.infos;
}

module.exports = DownloadController;
