<!-- eslint-disable max-len -->
<template>
  <context-holder />
  <div class="search">
    <h1 class="title">이 페이지는 검색 페이지입니다.</h1>
    <div class="search-form">
      <svg
        class="search-icon"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        ></path>
      </svg>
      <input
        type="text"
        class="search-input"
        v-model="searchQuery"
        aria-label="search-input"
        placeholder="검색어를 입력하세요"
        @keypress.enter="handleSearch"
      />
      <section class="delete-section" v-if="showDeleteButton">
        <button class="delete-button" @click="clearSearchResults">X</button>
      </section>
    </div>
    <div class="pre-search-form">
      <button class="pre-search-list" @click="test">검색정보 설정</button>
    </div>
  </div>
</template>

<script setup>
import { isEmpty } from "@/shared/utils";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";

// 검색어를 저장하는 변수
const searchQuery = ref("");
// Vuex store에서 news state를 가져옵니다.
const store = useStore();
// news state를 computed property로 가져옵니다.
const news = computed(() => store.state.news);
// Vue Router를 가져옵니다.
const router = useRouter();
// 검색어가 입력됨을 감지하고, 검색어가 입력되면 초기화 버튼을 생성합니다.
const showDeleteButton = computed(() => !isEmpty(searchQuery.value));

/**
 * 검색어를 입력하고 엔터를 누르면 검색을 수행합니다.
 *
 * @throws {Error}
 */
const handleSearch = async () => {
  try {
    store.dispatch("toggleLoading", true);
    await store.dispatch("fetchNews", {
      query: searchQuery.value,
      startDate: "2024.12.01",
      endDate: "2024.12.31",
    });
    // Electron에서만 동작합니다.
    if (!isEmpty(window?.electron?.ipcRenderer)) {
      window?.electron?.ipcRenderer?.send("show-notification", {
        title: "검색 완료",
        body: "뉴스 검색이 완료되었습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    store.dispatch("toggleLoading", false);
  }
};

/**
 * 검색어를 초기화합니다.
 */
const clearSearchResults = () => {
  searchQuery.value = "";
};

const test = () => {
  router.push("/results");
};

watch(news, (newValue) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", newValue);
  // 검색 결과가 없으면 메세지를 표출 한 후 종료합니다.
  if (isEmpty(newValue)) {
    message.error("검색 결과가 없습니다.");
    return;
  }
  // 검색 결과가 있으면 "/result" 경로로 이동합니다.
  router.push("/results");
});
</script>

<style lang="scss" scoped>
.search {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  .title {
    margin: 0;
    width: 100%;
    margin-top: 300px;
  }
  .search-form {
    display: flex;
    z-index: 3;
    position: relative;
    min-height: 44px;
    background: #fff;
    border: 1px solid #dfe1e5;
    box-shadow: 0px 2px 8px 0px rgba(60, 64, 67, 0.25);
    border-radius: 24px;
    margin: 0 auto;
    width: 50%;
    min-width: 358px;
    max-width: 582px;
    margin-top: 38px;
    align-items: center;
    .search-input {
      height: 40px;
      width: 80%;
      border: none;
      display: flex;
      justify-content: center;
      margin-right: 14px;
    }
    .search-input:focus {
      outline: none;
    }
    .search-icon {
      margin: 10px;
      width: 20px !important;
      height: 20px;
      fill: #000;
      align-items: center;
    }
    .delete-section {
      display: flex;
      align-items: center;
      gap: 2px;
      .delete-button {
        width: 20px;
        height: 20px;
        border: none;
        background-color: transparent;
        color: #000;
        font-size: 16px;
        cursor: pointer;
        margin-right: 8px;
      }
    }
  }
  .pre-search-form {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .pre-search-list {
      padding: 10px 20px;
      width: auto;
      background-color: #fff;
      border: 0;
      text-decoration: underline blue;
      text-underline-offset: 3px;
      color: blue;
    }
  }
}
</style>
