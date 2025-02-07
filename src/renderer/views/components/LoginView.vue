<template>
  <div class="content">
    <div class="login-content">
      <h2 class="login-title">로그인</h2>
      <div class="id-form">
        <span class="id-text">아이디</span>
        <a-input
          class="id"
          v-model:value="userId"
          placeholder="아이디를 입력하세요."
          allow-clear
          @keyup.enter="handleLogin"
        />
      </div>
      <div class="password-form">
        <button tabindex="-1" class="password-text" @click="handleMoveMasterView">비밀번호</button>
        <a-input-password
          class="password"
          v-model:value="password"
          placeholder="비밀번호를 입력하세요."
          allow-clear
          @keyup.enter="handleLogin"
        />
      </div>
      <a-button type="primary" :loading="loading" class="login-button" @click="handleLogin"
        >로그인</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { isEmpty } from "@/shared/utils";
import { message } from "ant-design-vue";

// 아이디 입력값
const userId = ref("");
// 비밀번호 입력값
const password = ref("");
// 로그인 로딩 상태
const loading = ref(false);
// Vuex store
const store = useStore();
// Vue Router
const router = useRouter();
// 로그인 요청이 완료됨을 감지합니다.
const isLogin = computed(() => store.state.auth.isLogin);
// 마스터 관리자 로그인 화면으로 이동하기 위한 변수
let count = 0;

/**
 * 마스터 권한 화면 이동
 *
 * 조건 : 유저ID: admin, 비밀번호 텍스트 버튼 5회이상 클릭 시
 */
const handleMoveMasterView = () => {
  if (count > 5 && userId.value === "admin") {
    router.push("/master/login");
    count = 0;
  } else {
    count += 1;
  }
};

/**
 * 로그인 요청
 */
const handleLogin = () => {
  if (isEmpty(userId.value) || isEmpty(password.value)) {
    message.warn(`${isEmpty(userId.value) ? "아이디" : "비밀번호"}를 입력 해 주세요.`);
    return;
  }
  loading.value = true;
  store.dispatch("auth/login", { userId: userId.value, password: password.value });
};

watch(
  () => isLogin.value,
  (newValue) => {
    if (newValue) {
      router.replace("/search/keywords");
    } else if (newValue === false) {
      store.commit("auth/setIsLogin", null);
      loading.value = false;
    }
  }
);
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f1f5f8;
  .login-content {
    display: flex;
    height: 300px;
    width: 320px;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 16px;

    .login-title {
      font-size: 28px;
      margin-bottom: 14px;
      color: #0a3d62;
    }
    .id-form {
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 80%;
      .id-text {
        font-size: 13px;
        font-weight: bold;
      }
    }

    .password-form {
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 80%;
      .password-text {
        font-size: 13px;
        font-weight: bold;
        background: none;
        border: none;
        padding: 0;
        color: #2c3250;
      }
    }

    .login-button {
      width: 80%;
      margin-top: 20px;
      background-color: #0a3d62;
    }
  }
}
</style>
