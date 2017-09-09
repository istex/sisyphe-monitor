const xxh = require("xxhashjs").h32;

function LogsController($scope, $interval, Modules) {
  Modules.launch();
  let logsErrorH;
  let errors = {};
  errorsH = new Set();
  $interval(_ => {
    const kellogs = Modules.getLogs();
    if (kellogs) {
      if (kellogs.hasOwnProperty("error") && kellogs.error) kellogs.error.map(error=>errors[error.time] = error)
      $scope.logsInfo = kellogs.info;
      $scope.logsWarning = kellogs.warning;
    }
}, 100);
$scope.logsError = errors;
}
module.exports = LogsController;
