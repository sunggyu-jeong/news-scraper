<template>
  <SubHeader title="검색결과" :btn-show="true" />
  <div class="result-content-view">
    <span>검색기간: {{ startDate }} ~ {{ endDate }}</span>
    <button type="button" @click="exportToExcel">엑셀 다운로드</button>
  </div>
  <div v-if="isMobile" class="card-view">
    <div v-for="(item, index) in newsList" :key="index" class="card">
      <!-- <div class="card-header">
        <h3>{{ item.newsType }}</h3>
        <span>{{ item.keyword }}</span>
      </div> -->
      <a-space class="space" :size="16">
        <div class="card-body">
          <span class="title">{{ item.title }}</span>
          <span class="source">{{ `${item.source} | ${item.keyword}` }}</span>
        </div>
        <a :href="item.link" target="_blank" rel="noopener noreferrer" class="link">
          <img src="../../assets/img/forward.png" alt="arrow" class="arrow" />
        </a>
      </a-space>
    </div>
  </div>
  <div v-else>
    <a-table
      class="result-table-view"
      :columns="columns"
      :data-source="newsList"
      :pagination="false"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'link'">
          <a :href="text" target="_blank" rel="noopener noreferrer">{{ text }}</a>
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
import SubHeader from "../../shared-components/layout/SubHeader.vue";

// Vue Router를 가져옵니다.
const route = useRoute();
// URL 쿼리에서 오류 message 값을 가져옵니다.
const { startDate, endDate } = route?.query || {};
// Vuex store에서 news state를 가져옵니다.
const store = useStore();
// 뉴스 검색 결과를 가져옵니다.
const newsList = computed(() => store.state.news.newsList);
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
    width: 120,
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
  isMobile.value = window.innerWidth <= 768;
};

/**
 * 뉴스 결과에 따라 특정 셀에 사용자 정의 스타일을 적용합니다.
 *
 * @param {Object} ws - 스타일이 적용될 워크시트 객체입니다.
 */
const applyCustomStyles = (ws) => {
  newsList.value.forEach((result, index) => {
    const keywordCell = ws[`G${10 + index}`];
    const titleCell = ws[`I${10 + index}`];
    if (titleCell && keywordCell && result.title.includes(keywordCell.v)) {
      titleCell.s = {
        font: { name: "맑은 고딕", sz: 12, color: { rgb: "FF0000" } },
      };
    }
  });
};

/**
 * 주어진 워크시트에 사용자 정의 스타일을 적용합니다.
 *
 * @param {Object} ws - 스타일을 적용할 워크시트 객체.
 *
 * 이 함수는 다음과 같은 스타일링 작업을 수행합니다:
 * 1. 모든 셀의 기본 글꼴을 "맑은 고딕", 크기 12, 굵게 하지 않음, 검정색으로 설정합니다.
 * 2. 특정 헤더 셀(B9, F9, G9, H9, I9, J9)을 굵은 글꼴, 파란색, 연한 파란색 배경, 가운데 정렬로 스타일링합니다.
 * 3. 9번째 행의 높이를 30 픽셀로 설정합니다.
 * 4. 특정 셀(F1, F2)을 굵은 글꼴, 파란색, 연한 파란색 배경으로 스타일링합니다.
 * 5. 특정 셀(G1, G2)을 수평 및 수직으로 가운데 정렬합니다.
 * 6. 워크시트의 열 너비를 설정합니다.
 *
 * @example
 * const worksheet = {}; // 유효한 워크시트 객체라고 가정합니다.
 * styleSheet(worksheet);
 */
const styleSheet = (ws) => {
  // 전체 셀 폰트 설정
  Object.keys(ws).forEach((cellAddress) => {
    if (!cellAddress.startsWith("!")) {
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      ws[cellAddress].s.font = {
        name: "맑은 고딕",
        sz: 12,
        bold: false,
        color: { rgb: "000000" },
      };
    }
  });

  const headerRowIndex = 9;
  const headerCells = ["B", "F", "G", "H", "I", "J"];

  // 헤더 셀 스타일 설정
  headerCells.forEach((col) => {
    const cell = ws[`${col}${headerRowIndex}`];
    if (cell) {
      cell.s = {
        font: { name: "맑은 고딕", bold: true, sz: 12, color: { rgb: "0A3D62" } },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "D6E6F5" },
        },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  ws["!rows"] = [];
  ws["!rows"][8] = { hpx: 30 };

  // 볼드처리하는 셀 설정
  const boldCells = ["F1", "F2"];
  boldCells.forEach((cellAddress) => {
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { name: "맑은 고딕", bold: true, sz: 12, color: { rgb: "0A3D62" } },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "D6E6F5" },
        },
      };
    }
  });

  // 가운데정렬이 필요한 셀 설정
  const centerAlignedCells = ["G1", "G2"];
  centerAlignedCells.forEach((cellAddress) => {
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  ws["!cols"] = [
    { wch: 10 },
    { wch: 25 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 80 },
    { wch: 150 },
  ];

  applyCustomStyles(ws);
};

/**
 * 주어진 news results를 XLSX로 변환합니다.
 *
 * @returns {Object} XLSX workbook - XLSX workbook object
 */
const createSheetWithData = () => {
  const uniqueKeywords = [...new Set(newsList.value.map((result) => result.keyword))];
  return XLSX.utils.json_to_sheet(
    [
      ["", "", "", "", "", "갯수", newsList.value.length],
      ["", "", "", "", "", "조회기간", `${startDate} ~ ${endDate}`],
      [],
      [],
      [],
      [],
      [],
      [],
      ["", "검색어", "", "", "", "뉴스타입", "검색어", "언론사", "타이틀", "링크"],
      ...newsList.value.map((result, index) => [
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
};

/**
 * 엑셀 다운로드 요청
 */
const exportToExcel = () => {
  const wb = XLSX.utils.book_new();
  const ws = createSheetWithData();
  styleSheet(ws);
  XLSX.utils.book_append_sheet(wb, ws, "news");
  XLSX.writeFile(wb, `search_result_${dayjs().format("YYYY-MM-DD_HHmmss")}.xlsx`);
};

onMounted(() => {
  checkIfMobile();

  window.addEventListener("resize", checkIfMobile);
  console.log(newsList.value, "페이지 로드 완료");
});
</script>

<style lang="scss" scoped>
.result-content-view {
  display: flex;
  justify-content: space-between;
  margin: 10px;
  margin-top: 53px;
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
    filter: opacity(0.5) drop-shadow(0 0 0 #0a3d62);
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
