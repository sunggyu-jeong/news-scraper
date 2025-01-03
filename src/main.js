import { createApp } from "vue";
import App from "./renderer/components/App.vue";
import router from "./renderer/router";
import store from "./renderer/store";
import "vue-loading-overlay/dist/css/index.css";

createApp(App).use(store).use(router).mount("#app");
