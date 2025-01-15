export default {
  namespaced: true,
  state: {
    isLoading: false,
  },
  getters: {
    getLoading: (state) => state.isLoading,
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    toggleLoading({ commit }, isLoading) {
      commit("setLoading", isLoading);
    },
  },
};
