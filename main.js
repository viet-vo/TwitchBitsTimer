const { app, BrowserWindow, Menu } = require("electron");
//const { URL, URLSearchParams } = require('url');
const path = require("path");
const fetch = require("electron-fetch").default;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
}

let win;

app.on("second-instance", (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.focus();
  }

  let input = commandLine.pop();
  let url = new URL(input);
  if (url.host == "twitchauth") {
    let pathparts = url.pathname.split("/");
    runToken(pathparts[1]);
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 125,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    transparent: true,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
