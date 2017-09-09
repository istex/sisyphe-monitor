/**
 * List of help function
 * @constructor
 */
function MonitorHelpers() { }

/**
 * Convert an object to an array with array of properties inside
 * @param  {Object} object Object with properties
 * @return {Array}        Array of properties
 */
MonitorHelpers.prototype.propertyToArray = function (object) {
  const arrayWaitingModules = [];
  for (var value in object) {
    if (object.hasOwnProperty(value)) {
      arrayWaitingModules.push([value, object[value].waiting, object[value].failed]);
    }
  }
  return arrayWaitingModules;
};

/**
 * Format array of log with colors
 * @param  {Array} log array containing type containing log
 * @return {Array}        Array logs with colors
 */
MonitorHelpers.prototype.getColorLog = function (logs) {
  const formatedLogs = [];
  if (!logs) return [];
  const types = Object.keys(logs);
  for (var i = 0; i < types.length; i++) {
    const type = Object.keys(logs)[i];
    formatedLogs.push('┌─────────────────────');
    formatedLogs.push('├─ ' + type + ':');
    for (var j = 0; j < logs[type].length; j++) {
      const text = logs[type][j]
      formatedLogs.push('├─── ' + logs[type][j].split('##')[0]);
      if (text.includes('##')) {
        text.split('##').map((info, index) => {
          if (index !== 0) {
            formatedLogs.push('├───── ' + info)
          }
        })
      }
    }
    formatedLogs.push('└─────────────────────');
  }
  return formatedLogs;
};

/**
 * Returns a color corresponding to the percentage
 * @param  {Number} percent A percentage
 * @return {String}         A color
 */
MonitorHelpers.prototype.getColorOfPercent = function (percent) {
  switch (true) {
    case percent >= 0 && percent <= 20:
      return 'red';
    case percent > 20 && percent <= 40:
      return 'yellow';
    case percent > 40 && percent <= 60:
      return 'magenta';
    case percent > 60 && percent <= 80:
      return 'cyan';
    case percent > 80 && percent <= 100:
      return 'green';
    default:
      return 'red';
  }
};

/**
 * Count properties in object
 * @param  {Object} object An object
 * @return {Number}        Number of properties
 */
MonitorHelpers.prototype.nbProperty = function (object) {
  let nbProperty = 0;
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      nbProperty++;
    }
  }
  return nbProperty;
};

/**
 * Get time between two date in milliseconds
 * @param  {Number} startDateInMs First date in milliseconds
 * @param  {Number} endDateInMs   Second date in milliseconds
 * @return {Date}                 A date containing hours, minutes and seconds between the first date and the second date
 */
MonitorHelpers.prototype.getTimeBetween = function (startDateInMs, endDateInMs) {
  const time = new Date();
  time.setSeconds((endDateInMs - startDateInMs) / (1000));
  time.setMinutes((endDateInMs - startDateInMs) / (1000 * 60));
  time.setHours((endDateInMs - startDateInMs) / (1000 * 60 * 60));
  time.setDate(~~((endDateInMs - startDateInMs) / (1000 * 60 * 60 * 24)));
  return time;
};

module.exports = new MonitorHelpers();
