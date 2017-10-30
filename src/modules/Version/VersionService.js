const rp = require("request-promise");
// let this.ConfigService;
function VersionService(ConfigService) {
  this.ConfigService = ConfigService;
}
VersionService.prototype.branches = function() {
  return rp(this.ConfigService.get("serverUrl") + "branches").then(result =>
    JSON.parse(result)
  );
};
VersionService.prototype.sisypheVersions = function() {
  return rp(
    this.ConfigService.get("serverUrl") + "sisypheVersions"
  ).then(result => JSON.parse(result));
};
VersionService.prototype.changeBranch = function(branch) {
  const uri = this.ConfigService.get("serverUrl") + "changeBranch";
  var options = { method: "POST", uri, body: { branch }, json: true };
  return rp(options).then(_ => branch);
};
VersionService.prototype.pull = function(branch) {
  console.log(branch);
  const uri = this.ConfigService.get("serverUrl") + "pull";
  var options = { method: "POST", uri, body: { branch }, json: true };
  return rp(options);
};
VersionService.prototype.status = function() {
  return rp(this.ConfigService.get("serverUrl") + "status");
};

module.exports = VersionService;
