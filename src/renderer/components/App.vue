<!-- eslint-disable import/extensions -->
<template>
  <a-config-provider>
    <router-view />
    <LoadingBar class="loading-bar" :isLoading="isLoading" />
  </a-config-provider>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { message } from "ant-design-vue";
import LoadingBar from "./LoadingBar.vue";

dayjs.locale("ko");

export default {
  components: {
    LoadingBar,
  },
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.state.loading.isLoading);
    const errorMessage = computed(() => store.state.errorMessage);

    watch(errorMessage, (newErrorMessage) => {
      if (newErrorMessage) {
        message.warn(newErrorMessage);
        store.dispatch("clearErrorMessage");
      }
    });
    return {
      isLoading,
    };
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

html {
  height: 100%;
  width: 100%;
}

body {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
