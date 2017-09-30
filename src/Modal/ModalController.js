function ModalController ($scope, ModalService) {
  $scope.modal = ModalService.modal;
  $scope.hideModal = ModalService.hide;
}

module.exports = ModalController;
