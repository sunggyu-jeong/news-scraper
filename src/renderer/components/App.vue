<template>
  <router-view />
  <LoadingBar class="loading-bar" :isLoading="isLoading" />
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import LoadingBar from "./LoadingBar.vue";

export default {
  components: {
    LoadingBar,
  },
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.state.isLoading);
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
