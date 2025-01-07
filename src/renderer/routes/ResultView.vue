<template>
  <SubHeader title="검색결과" />
  <div class="result-content-view">
    <span>검색기간: {{ startDate }} ~ {{ endDate }}</span>
    <button>엑셀 다운로드</button>
  </div>
  <a-table class="result-table-view" :columns="columns" :data-source="news" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { computed, onMounted, h } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import SubHeader from "../views/common/SubHeader.vue";

// Vue Router를 가져옵니다.
const route = useRoute();
// URL 쿼리에서 오류 message 값을 가져옵니다.
const { startDate, endDate } = route?.query || {};

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
    headerCell: () => ({
      style: { backgroundColor: "green" },
    }),
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
    render: (text) => h("a", { href: text, target: "_blank" }, text),
  },
];

// Vuex store에서 news state를 가져옵니다.
const store = useStore();
// 뉴스 검색 결과를 가져옵니다.
const news = computed(() => store.state.news);

onMounted(() => {
  console.log(news.value, "페이지 로드 완료");
  console.log(startDate, "시작일", endDate, "��료일");
});
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
</style>
