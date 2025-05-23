import { createRouter, createWebHistory } from "vue-router";
import SearchView from "../views/components/SearchView.vue";
import ResultView from "../views/components/ResultView.vue";
import ErrorView from "../shared-components/ErrorView.vue";
import LoginView from "../views/components/LoginView.vue";
import SearchKeywordManagerView from "../views/components/KeywordManagerView.vue";
import MasterView from "../views/components/MasterView.vue";
import BatchView from "../views/components/BatchView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/master/login",
    name: "MasterLogin",
    component: MasterView,
  },
  {
    path: "/search/keywords",
    name: "SearchKeywords",
    component: SearchKeywordManagerView,
  },
  {
    path: "/search",
    name: "Search",
    component: SearchView,
  },
  {
    path: "/batch-manage",
    name: "Batch",
    component: BatchView,
  },
  {
    path: "/results",
    name: "Results",
    component: ResultView,
  },
  {
    path: "/error",
    name: "Error",
    component: ErrorView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.fullPath === "/" && localStorage.getItem("token")) {
    next("/search");
  } else if (to.fullPath === "/") {
    next("/login");
  }
  next();
});

export default router;
