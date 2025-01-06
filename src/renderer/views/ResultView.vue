<template>
  <div>결과 뷰 입니다.</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

// Vuex store에서 news state를 가져옵니다.
const store = useStore();
// 뉴스 검색 결과를 가져옵니다.
const news = computed(() => store.getters.news);

onMounted(() => {
  console.log(news.value, "페이지 로드 완료");
});
</script>

<!-- <style lang="scss" scoped>

</style> -->
