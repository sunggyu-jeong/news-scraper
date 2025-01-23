const { Router } = require("express");
const { getNews } = require("../crawler/newsController.js");

const router = Router();

router.get("/news", getNews);

module.exports = router;
