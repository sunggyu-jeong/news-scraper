import { createStore } from "vuex";
// eslint-disable-next-line import/no-cycle
import auth from "./modules/auth";
import loading from "./modules/loading";
import news from "./modules/news";

export default createStore({
  state: {
    errorMessage: null,
  },
  mutations: {
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
    clearErrorMessage(state) {
      state.errorMessage = null;
    },
  },
  actions: {
    setErrorMessage({ commit }, errorMessage) {
      commit("setErrorMessage", errorMessage);
    },
    clearErrorMessage({ commit }) {
      commit("clearErrorMessage");
    },
  },
  modules: {
    auth,
    loading,
    news,
  },
});
