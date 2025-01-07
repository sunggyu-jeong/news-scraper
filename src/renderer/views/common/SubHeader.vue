<template>
  <header class="sub-header">
    <div class="header-wrap">
      <button
        class="btn btn-home"
        @click="navigateToPreviousPage(router)"
        @keydown.enter="navigateToPreviousPage(router)"
        tabindex="0"
      >
        <img src="../../assets/img/back_arrow.webp" alt="뒤로가기" class="btn btn-back" />
      </button>
      <h1 class="title">{{ props.title }}</h1>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { navigateToPreviousPage } from "../../../shared/utils";

const router = useRouter();

const props = defineProps({
  title: String,
  btnShow: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.sub-header {
  width: 100%;
  height: 40px;
  top: 0;
  position: fixed;
  background-color: white;
  z-index: 999;

  .header-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 30px;
      width: 30px;
      display: flex;
      background: #fff;
      border: none;
    }

    .btn-back {
      width: 75%;
      height: 75%;
    }

    .btn-home {
      left: 0;
    }

    .btn-right {
      right: 0;
    }

    .title {
      font-size: 16px;
      font-family: "Pretendard-Bold";
      color: #333d48;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
