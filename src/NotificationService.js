function NotificationService () {
  this.notifications = {
    errors: [],
    warnings: [],
    infos: [],
    total: 0
  };
}

NotificationService.prototype.add = function (type, message) {
  let insert = true;
  this.notifications[type + 's'].map(notification => {
    if (message === notification.message) {
      insert = false;
    }
  });
  if (insert) {
    this.notifications[type + 's'].push({
      id: Math.random(),
      type: type + 's',
      message
    });
    this.notifications.total++;
  }
};
NotificationService.prototype.remove = function (notificationToRemove) {
  this.notifications[notificationToRemove.type].map((notif, index, array) => {
    if (notif.id === notificationToRemove.id) { array.splice(index, 1); }
  });
  this.notifications.total--;
};

module.exports = NotificationService;
