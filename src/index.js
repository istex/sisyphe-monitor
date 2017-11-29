const listOfChildPid = [];
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
// const {
//   default: installExtension,
//   ANGULARJS_BATARANG
// } = require("electron-devtools-installer");

// installExtension(ANGULARJS_BATARANG)
//   .then(name => console.log(`Added Extension:  ${name}`))
//   .catch(err => console.log("An error occurred: ", err));
require('electron-context-menu')({
  showInspectElement: true,
  shouldShowMenu: (event, params) => params.isEditable
});
let win;
function createWindow () {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    icon: path.join(__dirname, 'public/img/icon.png')
  });
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  listOfChildPid.map(pid => process.kill(pid, 'SIGTERM'));
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const ipcMain = require('electron').ipcMain;
ipcMain.on('pid', function (event, arg) {
  listOfChildPid.push(arg);
});

const exit = function () {
  listOfChildPid.map(pid => process.kill(pid, 'SIGTERM'));
  if (process.platform !== 'darwin') {
    app.quit();
  }
};

// do something when app is closing
process.on('exit', exit.bind(null));
// catches ctrl+c event
process.on('SIGINT', exit.bind(null));
process.on('SIGTERM', exit.bind(null));
// // catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exit.bind(null));
process.on('SIGUSR2', exit.bind(null));
// catches uncaught exceptions
process.on('uncaughtException', exit.bind(null));
