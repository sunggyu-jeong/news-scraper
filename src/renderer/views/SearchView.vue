<!-- eslint-disable max-len -->
<template>
  <div class="search">
    <h1 class="title">이 페이지는 검색 페이지입니다.</h1>
    <div class="search-form" onclick="document.querySelector('.search-input').focus()">
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
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  name: "SearchBar",
  setup() {
    const searchQuery = ref("");

    const handleSearch = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/news", {
          params: {
            query: searchQuery.value,
            startDate: "2024.12.01",
            endDate: "2024.12.31",
          },
        });
        console.log(">>>>>>>>>>>>>>> ", response);
      } catch (error) {
        console.error(error);
      }
    };

    return {
      searchQuery,
      handleSearch,
    };
  },
};
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
      width: auto;
      max-width: 1300px;
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
      width: 20px;
      height: 20px;
      fill: #000;
      align-items: center;
    }
  }
}
</style>
