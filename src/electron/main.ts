import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

// redux
import { replayActionMain, forwardToRenderer } from '../ipc/redux/main';
import { createDockerMiddleware } from './docker/middleware';
import { combineReducers, createStore, applyMiddleware } from 'redux';

import data from '../app/store/data/reducer';
import session from '../app/store/session/reducer';
import { createElectronApiMiddleware } from './api/middleware';

let win: BrowserWindow, serve: boolean;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

try {
  require('dotenv').config();
} catch {
  console.log('asar');
}

const rootReducer = combineReducers({
  data,
  session
});

const store = createStore(
  rootReducer,
  applyMiddleware(
    createDockerMiddleware(),
    createElectronApiMiddleware(),
    forwardToRenderer // IMPORTANT! This goes last
  )
);
replayActionMain(store);

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  if (serve) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
