function ModalService () {
  this.modal = {};
}

ModalService.prototype.show = function (title, content) {
  this.modal.title = title;
  this.modal.content = content;
};

ModalService.prototype.hide = function () {
  delete this.modal.title;
  delete this.modal.content;
};

module.exports = ModalService
;
