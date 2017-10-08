function ProgressionController ($scope, WorkersService, ConfigService, $state) {
  $scope.percent = function () {
    return WorkersService.percents.totalPercent;
  };
}
module.exports = ProgressionController;
