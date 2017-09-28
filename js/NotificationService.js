function NotificationService () {
  this.notifications = {
    errors: [],
    warnings: [],
    infos: [],
    total: 0
  };
}

NotificationService.prototype.add = function (type, message) {
  this.notifications[type + "s"].push({
    id: Math.random(),
    message
  });
  this.notifications.total++;
};
NotificationService.prototype.remove = function (type, id) {
  this.notifications[type].map((notif, index) =>
    this.notifications[type].splice(index, 1)
  );
  this.notifications.total--;
};

module.exports = NotificationService;
