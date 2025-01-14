import { createRouter, createWebHistory } from "vue-router";
import SearchView from "../views/components/SearchView.vue";
import ResultView from "../views/components/ResultView.vue";
import ErrorView from "../views/components/ErrorView.vue";
import LoginView from "../views/components/LoginView.vue";
import SearchKeywordManagerView from "../views/components/SearchKeywordManagerView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/master/login",
    name: "MasterLogin",
    component: LoginView,
  },
  {
    path: "/search/keywords",
    name: "SearchKeywords",
    component: SearchKeywordManagerView,
  },
  {
    path: "/search",
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

router.beforeEach(async (to, from, next) => {
  if (to.fullPath === "/" && localStorage.getItem("token")) {
    next("/search");
  } else if (to.fullPath === "/") {
    next("/login");
  }
  next();
});

export default router;
