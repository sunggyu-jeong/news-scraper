import { createStore } from "vuex";
// eslint-disable-next-line import/no-cycle
import axiosInstance from "../config/AxiosInterceptor";

export default createStore({
  // 어플리케이션 상태 저장소
  state: {
    news: [],
    isLogin: null,
    isLoading: false,
    checkAuth: false,
    errorMessage: null,
  },
  // vuex 스토어 상태 값에 접근하는 함수
  getters: {
    getNews: (state) => state.news,
    getLoading: (state) => state.isLoading,
    getCheckAuth: (state) => state.checkAuth,
    getIsLogin: (state) => state.isLogin,
    getErrorMessage: (state) => state.errorMessage,
  },
  // vuex 스토어 상태값을 갱신하는 함수
  mutations: {
    setNews(state, news) {
      state.news = news;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setCheckAuth(state, checkAuth) {
      state.checkAuth = checkAuth;
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
  },
  // 작업을 수행하며 작업이 완료되면 mutations을 호출하여 상태를 변경하는 함수
  actions: {
    async fetchNews({ commit }, { queries, startDate, endDate }) {
      try {
        const repsonse = await axiosInstance.get("/api/news", {
          params: {
            queries,
            startDate,
            endDate,
          },
        });
        commit("setNews", repsonse.data);
      } catch (error) {
        console.error(error);
        throw new Error(error.response.data.message || "데이터를 가져오는데 실패했습니다.");
      }
    },
    async login({ commit }, { userId, password }) {
      try {
        const response = await axiosInstance.post("/api/user/login", {
          userId,
          password,
        });
        // eslint-disable-next-line dot-notation
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        commit("setIsLogin", true);
      } catch (error) {
        commit("setIsLogin", false);
        commit("setLoading", false);
        console.error(error);
        throw new Error(error?.response?.data?.message || "로그인 요청이 실패했습니다.");
      }
    },
    async getCheckAuth({ commit }) {
      try {
        await axiosInstance.get("/api/check");
        commit("setCheckAuth", true);
      } catch (error) {
        console.error(error);
        throw new Error(error.response.data.message || "인증 정보를 가져오는데 실패했습니다.");
      }
    },
    async silentRefresh() {
      try {
        const response = await axiosInstance.post("/api/user/refresh");
        // eslint-disable-next-line dot-notation
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
      } catch (error) {
        throw new Error(error?.response?.data?.message || "세션이 만료되었습니다.");
      }
    },
    toggleLoading({ commit }, isLoading) {
      commit("setLoading", isLoading);
    },
  },
  modules: {},
});
