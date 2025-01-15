import axiosInstance from "../../config/AxiosInterceptor";

export default {
  namespaced: true,
  state: {
    news: [],
    errorMessage: null,
  },
  getters: {
    getNews: (state) => state.news,
    getErrorMessage: (state) => state.errorMessage,
  },
  mutations: {
    setNews(state, news) {
      state.news = news;
    },
    setErrorMessage(state, message) {
      state.errorMessage = message;
    },
  },
  actions: {
    async fetchNews({ commit }, { queries, startDate, endDate }) {
      try {
        const response = await axiosInstance.get("/api/news", {
          params: {
            queries,
            startDate,
            endDate,
          },
        });
        commit("setNews", response.data);
      } catch (error) {
        console.error(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message || "데이터를 가져오는데 실패했습니다."
        );
        throw new Error(error.response?.data?.message || "데이터를 가져오는데 실패했습니다.");
      }
    },
  },
};
