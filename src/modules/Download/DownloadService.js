const request = require("request");
const progress = require("request-progress");
const mkdirp = require("mkdirp");
const pathfs = require("path");
const fs = require("fs");
function DownloadService(ConfigService) {
  this.ConfigService = ConfigService;
  this.downloads = [];
}
DownloadService.prototype.add = function(path) {
  const url = this.ConfigService.get("serverUrl") + path;
  const filename = pathfs.basename(path);
  this.downloads.push({
    url,
    path,
    filename
  });
};

DownloadService.prototype.launch = function() {
  const { dialog } = require("electron").remote;
  const pathToSave = dialog
    .showOpenDialog({ properties: ["openDirectory"] })
    .pop();
  this.downloads.map(download => {
    const url = download.url;
    const path = download.path;
    mkdirp.sync(pathfs.dirname(pathfs.resolve(pathToSave, path)));
    progress(request(url), {})
      .on("progress", function(state) {
        download.speed = (state.speed / 10000000).toFixed(2);
        download.time = state.time
        download.size = state.size
        download.percent = (( state.size.transferred * 100 ) / state.size.total).toFixed(0)
      })
      .on("end", function() {
        download.end = true;
        download.speed = 0;
        download.percent = 0;
      })
      .pipe(fs.createWriteStream(pathfs.resolve(pathToSave, path)));
  });
};

DownloadService.prototype.getDownloads = function() {
  return this.downloads;
};
module.exports = DownloadService;
