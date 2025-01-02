// controllers/newsController.js
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * 뉴스 크롤링 로직
 * @param {Object} req - 요청 정보
 * @param {Object} res - 응답 정보
 */
exports.getNews = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({
      status: 400,
      message: "검색어를 입력하세요.",
      messageDev: "사용자의 검색어 입력 오류",
    });
  }

  try {
    const response = await axios.get(
      `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=${encodeURIComponent(
        query
      )}`
    );
    const $ = cheerio.load(response.data);
    const newsList = [];
    $("#main_pack > div.news_area._main_news > ul > li").each((i, el) => {
      const title = $(el).find(".news_tit > a").text().trim();
      const link = $(el).find(".news_tit > a").attr("href");
      const description = $(el).find(".news_desc").text().trim();
      const source = $(el).find(".info_group .press").text();
      newsList.push({ title, link, description, source });
    });
    res.json(newsList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "크롤링 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: "크롤링 오류 발생",
    });
  }
  return res;
};
