import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  // 어플리케이션 상태 저장소
  state: {
    news: [],
  },
  // vuex 스토어 상태 값에 접근하는 함수
  getters: {
    getNews: (state) => state.news,
  },
  // vuex 스토어 상태값을 갱신하는 함수
  mutations: {
    setNews(state, news) {
      state.news = news;
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
        commit("setNews", repsonse.data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {},
});
