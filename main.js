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

/*
Custom URI Handler
*/
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("aiyo_timer", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("aiyo_timer");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
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

function runToken(token) {
  let client_id = "";
  fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      client_id = resp.client_id;
      return fetch("https://api.twitch.tv/helix/users", {
        headers: {
          Accept: "application/json",
          "Client-ID": client_id,
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log("Got user", resp);

      // ipc
      win.webContents.send("twitch_user", resp.data[0]);
    })
    .catch((err) => {
      console.log("An Error Occurred", err);
    });
}
