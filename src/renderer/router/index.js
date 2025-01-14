import { createRouter, createWebHistory } from "vue-router";
// import { computed } from "vue";
// import { useStore } from "vuex";
// import { isEmpty } from "@/shared/utils";
import SearchView from "../views/components/SearchView.vue";
import ResultView from "../views/components/ResultView.vue";
import ErrorView from "../views/components/ErrorView.vue";
import LoginView from "../views/components/LoginView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
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

router.beforeEach((to, from, next) => {
  if (to.fullPath === "/" && localStorage.getItem("token")) {
    next("/search");
  } else if (to.fullPath === "/") {
    next("/login");
  }
  next();
});

export default router;
