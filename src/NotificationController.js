function NotificationController ($scope, $interval, NotificationService) {
  $scope.remove = NotificationService.remove;
  $scope.show = false;
  $scope.notifications = NotificationService.notifications;
}

module.exports = NotificationController;
