<template>
  <SubHeader />
  <div class="result-content-view">결과</div>
  <a-table class="result-table-view" :columns="columns" :data-source="news" :pagination="disabled">
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
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import SubHeader from "../views/common/SubHeader.vue";
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
    width: 150,
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

// Vuex store에서 news state를 가져옵니다.
const store = useStore();
// 뉴스 검색 결과를 가져옵니다.
const news = computed(() => store.state.news);

onMounted(() => {
  console.log(news.value, "페이지 로드 완료");
});
</script>

<style lang="scss" scoped>
.result-content-view {
  margin-top: 40px;
}
</style>
