const express = require("express");

const router = express.Router();
const { getNews } = require("../server/controller/scraper");

router.get("/news", getNews);

module.exports = router;
