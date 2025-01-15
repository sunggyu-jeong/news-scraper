import axiosInstance from "../../config/AxiosInterceptor";

export default {
  namespaced: true,
  state: {
    isLogin: null,
    checkAuth: false,
  },
  getters: {
    getIsLogin: (state) => state.isLogin,
    getCheckAuth: (state) => state.checkAuth,
  },
  mutations: {
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    setCheckAuth(state, checkAuth) {
      state.checkAuth = checkAuth;
    },
  },
  actions: {
    async login({ commit }, { userId, password }) {
      try {
        const response = await axiosInstance.post("/api/user/login", {
          userId,
          password,
        });
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`;
        commit("setIsLogin", true);
      } catch (error) {
        commit("setIsLogin", false);
        console.error(error);
        commit("setErrorMessage", error.response?.data?.message || "로그인 요청이 실패했습니다.", {
          root: true,
        });
      }
    },
    async getCheckAuth({ commit }) {
      try {
        await axiosInstance.get("/api/check");
        commit("setCheckAuth", true);
      } catch (error) {
        console.error(error);
        commit("setCheckAuth", false);
        commit(error.response?.data?.message || "인증 정보를 가져오는데 실패했습니다.", {
          root: true,
        });
      }
    },
    async silentRefresh({ commit }) {
      try {
        const response = await axiosInstance.post("/api/user/refresh");
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`;
      } catch (error) {
        commit(error?.response?.data?.message || "세션이 만료되었습니다.", {
          root: true,
        });
      }
    },
  },
};
