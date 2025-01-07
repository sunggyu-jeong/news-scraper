<template>
  <SubHeader title="검색결과" />
  <div class="result-content-view">
    <span>검색기간: {{ startDate }} ~ {{ endDate }}</span>
    <button @click="exportToExcel">엑셀 다운로드</button>
  </div>
  <div v-if="isMobile" class="card-view">
    <div v-for="(item, index) in news" :key="index" class="card">
      <!-- <div class="card-header">
        <h3>{{ item.newsType }}</h3>
        <span>{{ item.keyword }}</span>
      </div> -->
      <a-space class="space" :size="16">
        <div class="card-body">
          <span class="title">{{ item.title }}</span>
          <span class="source">{{ item.source }}</span>
        </div>
        <a :href="item.link" target="_blank" class="link">
          <img src="../assets/img/forward.png" alt="arrow" class="arrow" />
        </a>
      </a-space>
    </div>
  </div>
  <div v-else>
    <a-table class="result-table-view" :columns="columns" :data-source="news" :pagination="false">
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'link'">
          <a :href="text" target="_blank">{{ text }}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import * as XLSX from "xlsx-js-style";
import dayjs from "dayjs";
import SubHeader from "../views/common/SubHeader.vue";

// Vue Router를 가져옵니다.
const route = useRoute();
// URL 쿼리에서 오류 message 값을 가져옵니다.
const { startDate, endDate } = route?.query || {};
// Vuex store에서 news state를 가져옵니다.
const store = useStore();
// 뉴스 검색 결과를 가져옵니다.
const news = computed(() => store.state.news);
// isMobile: true일 경우 모바일, false일 경우 PC
const isMobile = ref(false);
// 뉴스타입,검색어,언론사,타이틀,링크
const columns = [
  {
    title: "뉴스타입",
    dataIndex: "newsType",
    key: "newsType",
    width: 130,
    align: "center",
  },
  {
    title: "검색어",
    dataIndex: "keyword",
    key: "keyword",
    width: 100,
    align: "center",
  },
  {
    title: "언론사",
    dataIndex: "source",
    key: "source",
    width: 180,
  },
  {
    title: "타이틀",
    key: "title",
    dataIndex: "title",
    width: 450,
  },
  {
    title: "링크",
    key: "link",
    dataIndex: "link",
  },
];

/**
 * 접속된 플랫폼이 모바일인지 확인합니다.
 */
const checkIfMobile = () => {
  console.log("window.innerWidth:", window.innerWidth);
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkIfMobile();

  window.addEventListener("resize", checkIfMobile);
  console.log(news.value, "페이지 로드 완료");
  console.log(startDate, "시작일", endDate, "��료일");
});

/**
 * 엑셀 다운로드 요청
 */
const exportToExcel = () => {
  const uniqueKeywords = [...new Set(news.value.map((result) => result.keyword))];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(
    [
      ["", "", "", "", "", "갯수", news.value.length],
      ["", "", "", "", "", "조회기간", `${startDate} ~ ${endDate}`],
      [],
      [],
      [],
      [],
      [],
      [],
      ["", "검색어", "", "", "", "뉴스타입", "검색어", "언론사", "타이틀", "링크"],
      ...news.value.map((result, index) => [
        "",
        uniqueKeywords.length > index ? uniqueKeywords[index] : "",
        "",
        "",
        "",
        result.newsType,
        result.keyword,
        result.source,
        result.title,
        { t: "s", v: result.link, l: { Target: result.link } },
      ]),
    ],
    { skipHeader: true }
  );

  // news.value.forEach((result, index) => {
  //   const keyword = ws[`G${9 + index}`];
  //   const cell = ws[`I${9 + index}`];
  //   if (result.title.includes(keyword?.v)) {
  //     cell.s = { font: { color: { rgb: "FF0000" }, bold: true } };
  //   } else {
  //     cell.s = { font: { color: { rgb: "000000" } } };
  //   }
  // });

  XLSX.utils.book_append_sheet(wb, ws, "news");
  XLSX.writeFile(wb, `search_result_${dayjs().format("YYYY-MM-DD_HHmmss")}.xlsx`);
};
</script>

<style lang="scss" scoped>
.result-content-view {
  display: flex;
  justify-content: space-between;
  margin: 10px;
  margin-top: 80px;
  align-items: start;
  display: flex;
  font-size: 14px;
  font-family: sans-serif;
  span {
    font-weight: bold;
    align-self: center;
  }
  button {
    background-color: #383d42;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
  }
}
.card-view {
  display: block;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-left: 8px;
  margin-right: 8px;
  span {
    font-size: 14px;
    font-family: sans-serif;
  }
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  h3 {
    margin: 0;
  }
}

.space {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.card-body {
  display: flex;
  flex-direction: column;
  margin: 8px 0px 0px 8px;
  width: 100%;
  .title {
    font-weight: bold;
    margin-bottom: 5px;
    display: flex;
    justify-content: start;
    text-align: start;
  }
  .source {
    color: gray;
    margin-bottom: 5px;
    display: flex;
    justify-content: start;
  }
}
.link {
  color: blue;
  text-decoration: none;
  display: flex;
  justify-content: baseline;
  min-width: 25px;
  margin-right: 8px;
  .arrow {
    width: 15px;
    height: 23px;
    filter: opacity(0.5) drop-shadow(0 0 0 #228b22);
  }
}

.card a {
  color: #0066cc;
  text-decoration: none;
}

.card a:hover {
  text-decoration: underline;
}
</style>
