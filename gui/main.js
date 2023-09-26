/*
 * main.js
 *
 */

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const forever = require('forever-monitor');
const server = require('../index.js');

const child = new (forever.Monitor)('./run-speedtest.js', {
  max: 3,
  silent: false,
  args: ['daemon'],
  fork: true,
  env: { ELECTRON_RUN_AS_NODE: 1 },
});

child.on('watch:restart', (info) => {
  console.error(`TODO: Restarting script because ${info.file} changed`);
});

child.on('restart', () => {
  console.error(`TODO: Deamon has restartet for ${child.times} time !!!!`);
});

child.on('exit:code', (code) => {
  console.error(`TODO: Deamon has exited with code ${code} !!!!`);
});

child.on('exit', () => {
  console.log('TODO: Deamon has exited !!!!');
});

child.on('start', () => {
  console.log('TODO: Deamon has started !!!!');
});

child.on('stderr', (data) => {
  console.log(`TODO: Deamon has an error !!!! ${data}`);
});
child.on('error', (data) => {
  console.log(`TODO: Forever has an error !!!! ${data}`);
});

async function handleForeverStart(event) {
  if (!child.running) {
    child.start();
  }
  return true;
}

async function handleForeverStop(event) {
  if (child.running) {
    child.stop();
  }
  return true;
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.removeMenu();
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

app.whenReady().then(() => {
  ipcMain.handle('dialog:start-deamon', handleForeverStart);
  ipcMain.handle('dialog:stop-deamon', handleForeverStop);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// app.on;
