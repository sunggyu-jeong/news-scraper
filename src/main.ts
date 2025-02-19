import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./renderer/components/App.vue";
import router from "./renderer/router";
import store from "./renderer/store";
import "vue-loading-overlay/dist/css/index.css";
import axiosInstance, { setStore } from "./renderer/config/AxiosInterceptor";

const app = createApp(App);
setStore(store);

app.config.globalProperties.$axios = axiosInstance;
app
  .use(store) // Vuex Store 사용
  .use(router) // Vue Router 사용
  .use(Antd) // Ant Design Vue 사용
  .mount("#app"); // DOM에 마운트
