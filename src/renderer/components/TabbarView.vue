<template>
  <section class="tabbar_content">
    <div class="tabbar_items">
      <router-link v-for="(tab, key) in tabIconsWithColor" :key="key" :to="{ name: key }">
        <TabbarIcons :icon="tab.icon" :text="tab.text" :color="tab.color" />
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import TabbarIcons from "./TabbarIcons.vue";
import { AppstoreAddOutlined, SearchOutlined } from "@ant-design/icons-vue";

// `tabIconsWithColor` 계산하기
const tabIconsWithColor = computed(() => {
  return Object.keys(tabIcons).reduce((acc, key) => {
    acc[key] = {
      ...tabIcons[key],
      color: getColor(key), // 동적으로 색상 적용
    };
    return acc;
  }, {});
});
/** 페이지 라우터 */
const route = useRoute();
/** 컬러 */
const color = { default: "#89919D", active: "#CA413C" };
/** 버튼 아이콘 및 텍스트 정의 */
const tabIcons = {
  Search: { icon: SearchOutlined, text: "검색" },
  SearchKeywords: { icon: AppstoreAddOutlined, text: "키워드" },
};
/** 버튼 활성화 상태를 관리하는 상태 변수 */
const buttonActiveStates = ref({
  Search: false,
  SearchKeywords: false,
});

/**
 * 현재 선택된 버튼의 활성 상태에 따라 표시할 페이지를 변경
 */
const setPage = () => {
  Object.keys(buttonActiveStates.value).forEach((key) => {
    buttonActiveStates.value[key] = route.name === key;
  });
};

/**
 * 선택된 상태에 따라 컬러 동적 계산
 * @param key
 */
const getColor = (key) => (buttonActiveStates.value[key] ? color.active : color.default);

onMounted(setPage);
watch(() => route.name, setPage);
</script>

<style lang="scss" scoped>
.tabbar_content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #f0f1f3;
  box-sizing: border-box;
  z-index: 1000;

  .tabbar_items {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 12px 0 24px;
    a:-webkit-any-link {
      text-decoration: none;
    }
    .router-link-exact-active,
    .router-link-active,
    .router-link {
      text-decoration: none;
    }
  }
}
</style>
