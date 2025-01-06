import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  // 어플리케이션 상태 저장소
  state: {
    news: [],
    isLoading: false,
  },
  // vuex 스토어 상태 값에 접근하는 함수
  getters: {
    getNews: (state) => state.news,
    getLoading: (state) => state.isLoading,
  },
  // vuex 스토어 상태값을 갱신하는 함수
  mutations: {
    setNews(state, news) {
      state.news = news;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  // 작업을 수행하며 작업이 완료되면 mutations을 호출하여 상태를 변경하는 함수
  actions: {
    async fetchNews({ commit }, { query, startDate, endDate }) {
      try {
        const repsonse = await axios.get("http://localhost:3000/api/news", {
          params: {
            query,
            startDate,
            endDate,
          },
        });
        commit("setNews", repsonse.data.data);
      } catch (error) {
        console.error(error);
      }
    },
    toggleLoading({ commit }, isLoading) {
      commit("setLoading", isLoading);
    },
  },
  modules: {},
});
