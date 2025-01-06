<template>
  <header class="sub-header">
    <div class="header-wrap">
      <button v-if="btnShow" type="button" class="btn btn-back" @click="navigateToPreviousPage">
        뒤로가기
      </button>
      <h1>{{ props.title }}</h1>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";
import navigateToPreviousPage from "@/shared/utils";

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
  height: 48px;
  position: fixed;
  background-color: white;
  z-index: 999;

  .header-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    h1 {
      font-size: 16px;
      font-family: "Pretendard-Bold";
      color: #333d48;
      text-align: center;
      display: inline-block;
    }
    .btn {
      position: absolute;
      top: 0;
      min-width: 48px;
      height: 48px;
      display: flex;
      font-size: 0;
      &.btn-back {
        left: 0;
        &::before {
          content: "";
          width: 100%;
          height: 100%;
          display: block;
          mask: url("../../assets/img/icon/right_arrow.svg");
          mask-repeat: no-repeat;
          mask-position: center;
          mask-size: 32px;
          transform: rotate(-180deg);
          background: #333d48;
        }
      }
    }
  }
}
</style>
