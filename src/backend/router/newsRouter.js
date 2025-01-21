import { Router } from "express";
import { getNews } from "../crawler/newsController.js";

const router = Router();

router.get("/news", getNews);

export default router;
