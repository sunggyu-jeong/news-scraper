<template>
  <div class="loading-bar" v-if="isLoading">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingBar",
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onCancel() {
      console.log("onCancel");
    },
  },
};
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

  .spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-top: 8px solid #33383a;
    border-radius: 90%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
