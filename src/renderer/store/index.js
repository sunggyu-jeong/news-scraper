import { createStore } from "vuex";
import auth from "./modules/auth.js";
import loading from "./modules/loading.js";
import news from "./modules/news.js";
import keyword from "./modules/keyword.js";
import batchUser from "./modules/batchUser.js";

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
    keyword,
    batchUser
  },
});
