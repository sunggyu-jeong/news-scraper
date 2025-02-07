<template>
  <div class="loading-bar" v-if="isLoading">
    <div class="loading-text">
      <span class="dot dot-1"></span>
      <span class="dot dot-2"></span>
      <span class="dot dot-3"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
});

</script>

<style lang="scss" scoped>
.loading-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;

  .loading-text {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;

    .dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #33383a;
      margin: 0 5px;
      animation: jump 0.6s infinite alternate;
    }

    .dot-1 {
      animation-delay: 0s;
    }
    .dot-2 {
      animation-delay: 0.2s;
    }
    .dot-3 {
      animation-delay: 0.4s;
    }
  }
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-15px);
  }
}
</style>
