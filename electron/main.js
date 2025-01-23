const { app, BrowserWindow } = require("electron");
const { exec } = require("node:child_process");
const waitOn = require("wait-on");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const newsRouter = require("../src/backend/router/newsRouter.js");

const expressApp = express()
  .use(express.json())
  .use(helmet())
  .use(
    cors({
      origin: ["http://localhost:8080", "https://localhost:3000"],
      credentials: true,
    })
  )
  .use(cookieParser())
  .use("/api", express.Router().use(newsRouter))
  .use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "ws://192.168.0.33:8080"],
        },
      },
    })
  );

const port = 3001;

expressApp.use(express.static(path.join(__dirname, "dist")));

expressApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 프론트엔드 서버 실행
const startFrontendServer = () => {
  exec("npm run serve", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting frontend server: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Frontend stderr: ${stderr}`);
      return;
    }
    console.log(`Frontend stdout: ${stdout}`);
  });
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.webContents.openDevTools();
  win.loadURL("http://localhost:8080"); // 프론트엔드 서버의 URL
};

const startElectronApp = () => {
  waitOn({ resources: ["http://localhost:8080"] }, (err) => {
    if (err) {
      console.error("Error waiting for frontend to start:", err);
    }

    // Electron 실행
    createWindow();
  });
};

app.whenReady().then(() => {
  startFrontendServer();

  startElectronApp();
});
