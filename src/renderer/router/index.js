import { createRouter, createWebHistory } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";
import { isEmpty } from "@/shared/utils";
import SearchView from "../views/SearchView.vue";
import ResultView from "../views/ResultView.vue";
import ErrorView from "../views/ErrorView.vue";

const routes = [
  {
    path: "/",
    name: "search",
    component: SearchView,
  },
  {
    path: "/results",
    name: "results",
    component: ResultView,
  },
  {
    path: "/error",
    name: "error",
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const news = computed(() => store.getters.getNews);
  if (to.path === "/results" && isEmpty(news?.value)) {
    next({ name: "error", query: { message: "403" } });
  } else {
    next();
  }
});

export default router;
