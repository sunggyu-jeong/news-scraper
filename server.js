/* eslint-disable import/extensions */
import helmet from "helmet";
import express, { json } from "express";
import cors from "cors";
import apiRoutes from "./src/renderer/router/apiRoutes.js";

const app = express()
  .use(json())
  .use(helmet())
  .use(cors())
  .use("/api", apiRoutes)
  .use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "ws://192.168.0.33:8080"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "fonts.googleapis.com"],
          objectSrc: ["'none'"],
          mediaSrc: ["'none'"],
        },
      },
    })
  );
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
