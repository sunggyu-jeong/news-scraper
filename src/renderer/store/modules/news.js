import axiosInstance from "../../config/AxiosInterceptor";

export default {
  namespaced: true,
  state: {
    newsList: [],
  },
  getters: {
    getNewsList: (state) => state.newsList,
  },
  mutations: {
    setNewsList(state, newsList) {
      state.newsList = newsList;
    },
  },
  actions: {
    async fetchNews({ commit }, { queries, startDate, endDate }) {
      try {
        console.log("Fetching news");
        const response = await axiosInstance.get("/api/news", {
          params: {
            queries,
            startDate,
            endDate,
          },
        });
        commit("setNewsList", response.data);
      } catch (error) {
        console.error(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message ||
            "뉴스 검색 요청이 실패했습니다. 잠시 후 다시 시도해주세요.",
          {
            root: true,
          }
        );
      }
    },
  },
};
