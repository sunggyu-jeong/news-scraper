import express, { json, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import newsRouter from "./router/newsRouter.js";

const app = express()
  .use(json())
  .use(helmet())
  .use(
    cors({
      origin: ["http://localhost:8080", "https://localhost:3000"],
      credentials: true,
    })
  )
  .use(cookieParser())
  .use("/api", Router().use(newsRouter))
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

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
