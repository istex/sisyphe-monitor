const request = require('request');
const progress = require('request-progress');
const mkdirp = require('mkdirp');
const pathfs = require('path');
const fs = require('fs');
function DownloadService (ConfigService) {
  this.ConfigService = ConfigService;
  this.endDownloads = [];
  this.currentDownloads = [];
}
DownloadService.prototype.add = function (path, pathToSave) {
  const url = this.ConfigService.get('serverUrl') + path;
  const filename = pathfs.basename(path);
  this.currentDownloads.push({
    id: Math.random(),
    url,
    path,
    filename,
    pathToSave
  });
};

DownloadService.prototype.launch = function () {
  this.currentDownloads.map(download => {
    const url = download.url;
    const path = download.path;
    mkdirp.sync(pathfs.dirname(pathfs.join(download.pathToSave, path)));
    progress(request(url), {})
      .on('progress', function (state) {
        download.speed = (state.speed / 10000000).toFixed(2);
        download.time = state.time;
        download.size = state.size;
        download.percent = ((state.size.transferred * 100) / state.size.total).toFixed(0);
      })
      .on('end', () => {
        download.end = true;
        download.speed = 0;
        download.percent = 0;
        this.endDownloads.push(download);
        this.currentDownloads.map((downloadCurrent, index) => {
          if (downloadCurrent.id === download.id) {
            this.currentDownloads.splice(index, 1);
          }
        });
      })
      .pipe(fs.createWriteStream(pathfs.join(download.pathToSave, path)));
  });
};

DownloadService.prototype.getDownloads = function () {
  return this.currentDownloads;
};
module.exports = DownloadService;
