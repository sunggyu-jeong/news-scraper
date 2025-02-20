<!-- eslint-disable max-len -->
<template>
  <context-holder />
  <div class="search">
    <img src="../../assets/img/logo.png" alt="로고" class="logo" />
    <div class="search-form">
      <svg
        class="search-icon"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
        />
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
    <div class="description-content">
      <span class="description"
        >검색하실 검색어를 콤마로 연결해 주시면 다건 검색이 가능합니다.</span
      >
      <span class="description-ex">예) 검색어1,검색어2</span>
    </div>
    <div className="date-picker">
      <a-range-picker
        v-model:value="selectedPicker"
        :disabled-date="disabledDate"
        :allowClear="false"
      />
    </div>
  </div>
  <TabbarView />
</template>

<script setup>
import { isEmpty } from "@/shared/utils";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import TabbarView from "@/renderer/components/TabbarView.vue";
import useNews from "@/renderer/composables/useNews";

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
// 선택한 기간의 시작일과 종료일을 저장하는 변수
const selectedPicker = ref([dayjs().add(-1, "day"), dayjs()]);
// 검색된 뉴스 정보
const { newsList, fetchNews } = useNews();

/**
 * 검색어를 입력하고 엔터를 누르면 검색을 수행합니다.
 *
 * @throws {Error}
 */
const handleSearch = async () => {
  try {
    await fetchNews(
      searchQuery.value,
      dayjs(selectedPicker.value[0]).format("YYYY.MM.DD"),
      dayjs(selectedPicker.value[1]).format("YYYY.MM.DD")
    );
  } catch (error) {
    console.log(error);
    message.error(error);
  }
};

watch(newsList, (searchNewsList) => {
  if (isEmpty(searchNewsList.length)) {
    message.warning("검색된 정보가 없습니다.");
    return;
  }
  router.push({
    path: "/results",
    query: {
      startDate: dayjs(selectedPicker.value[0]).format("YYYY.MM.DD"),
      endDate: dayjs(selectedPicker.value[1]).format("YYYY.MM.DD"),
    },
  });
});

/**
 * 검색어를 초기화합니다.
 */
const clearSearchResults = () => {
  searchQuery.value = "";
};

/**
 * 비활성화 할 날짜를 설정합니다.
 *
 * @param current 현재 날짜
 */
const disabledDate = (current) => current && current > dayjs().endOf("day");

watch(news, (newValue) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", newValue);
  // 검색 결과가 없으면 메세지를 표출 한 후 종료합니다.
  if (isEmpty(newValue)) {
    message.error("검색 결과가 없습니다.");
    return;
  }
  // 검색 결과가 있으면 "/result" 경로로 이동합니다.
  router.push({
    path: "/results",
    query: {
      startDate: dayjs(selectedPicker.value[0]).format("YYYY.MM.DD"),
      endDate: dayjs(selectedPicker.value[1]).format("YYYY.MM.DD"),
    },
  });
});
</script>

<style lang="scss" scoped>
.search {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;

  .description-content {
    margin-top: 12px;
    margin-bottom: 8px;
    font-size: 10px;
    font-weight: 500;
    line-height: 1.71428571;
    color: #212121;
    display: flex;
    align-items: left;
    flex-direction: column;

    .description {
      font-size: 12px;
    }
  }

  .logo {
    margin: 0;
    width: 306px;
    margin-top: max(15%, 150px);
    align-self: center;
    filter: opacity(0.5) drop-shadow(0 0 0 #0a3d62);
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
  .date-picker {
    margin-top: 16px;
    .ant-picker {
      border: none;

      .ant-picker-suffix {
        display: none;
      }
    }
  }
}
</style>
