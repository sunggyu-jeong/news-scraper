const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("node:path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL("http://localhost:8080");

  ipcMain.on("show-notification", (event, { title, body }) => {
    new Notification({ title, body }).show();
  });
});
