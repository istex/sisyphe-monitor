function DownloadController ($scope, ConfigService, DownloadService) {
  $scope.launch = function () {
    DownloadService.launch()
  }
  setInterval(_=>{
    $scope.downloads = DownloadService.downloads
  },100)
  $scope.infos = DownloadService.infos;
}




module.exports = DownloadController;
