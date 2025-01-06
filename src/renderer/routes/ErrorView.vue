<template>
  <div class="error-view">
    <h1 class="error-code">{{ message }}</h1>
    <h3 class="error-message">유효하지 않은 접근입니다.</h3>
    <button class="error-return" @click="handleReturn">돌아가기</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

// Vue Router를 가져옵니다.
const router = useRouter();
// URL 쿼리에서 오류 message 값을 가져옵니다.
const message = router?.query?.message || "500";

/**
 * 돌아가기 버튼을 클릭했을 때, 이벤트를 핸들링합니다.
 *
 * 메인화면으로 이동합니다.
 */
const handleReturn = () => {
  router.replace("/");
};
</script>

<style lang="scss" scoped>
.error-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  .error-code {
    font-size: 4rem;
    color: black;
    margin: 0;
    font-weight: Bold;
    font-family: "Arial";
  }
  .error-message {
    margin: 15px;
    margin-top: 0.5rem;
    font-size: 1.5rem;
  }

  .error-return {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #333;
    color: white;
    cursor: pointer;
    font-size: 0.8rem;
  }
}
</style>
