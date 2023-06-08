const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

// import { ElectronAuthProvider } from "@twurple/auth-electron";
// require("dotenv").config();

const clientId = process.env.TWITCH_CLIENT_ID;
const redirectUri = process.env.TWITCH_REDIRECT_URI;

// const authProvider = new ElectronAuthProvider({
//   clientId,
//   redirectUri,
// });

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
