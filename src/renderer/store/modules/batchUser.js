import axiosInstance from "@/renderer/config/AxiosInterceptor";

export default {
  namespaced: true,
  state: {
    batchUserList: [],
    userInfo: null
  },
  getters: {
    getBatchUser: (state) => state.batchUserList,
    getUserInfo: (state) => state.userInfo
  },
  mutations: {
    setBatchUser(state, batchUserList) {
      state.batchUserList = batchUserList;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    async getBatchUser({ commit }) {
      try {
        const response = await axiosInstance.get("/api/automail/users");
        commit("setBatchUser", response.data);
      } catch (error) {
        commit("setBatchUser", false);
        console.error(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message || "사용자 목록 조회 요청에 실패했습니다.",
          {
            root: true,
          }
        );
      }
    },
    async addBatchUser({ commit }, request) {
      try {
        await axiosInstance.post("/api/automail/users", request);
      } catch (error) {
        console.log(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message || "사용자 등록 요청이 실패했습니다.",
          {
            root: true,
          }
        );
        throw error;
      }
    },
    async updateBatchUser({ commit }, request) {
      try {
        await axiosInstance.put("/api/automail/users", request);
      } catch (error) {
        console.log(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message || "사용자 정보 변경 요청에 실패했습니다.",
          {
            root: true,
          }
        );
        throw error;
      }
    },
    async deleteUser({ commit }, id) {
      try {
        await axiosInstance.delete(`/api/automail/users`, { params: { id } });
        commit("getBatchUser");
      } catch (error) {
        commit(
          "setErrorMessage",
          error.response?.data?.message || "사용자 삭제 요청에 실패했습니다.",
          {
            root: true,
          }
        );
        throw error;
      }
    },
    async manualBatch({ commit }, jobName) {
      try {
        await axiosInstance.post(`/api/batchjob/manual/run`, 
          { jobName },
          { baseURL: 'https://news-scraper-batch-production.up.railway.app' }
        );
      } catch (error) {
        commit(
          "setErrorMessage",
          error.response?.data?.message || "배치 수동실행 요청에 실패했습니다.",
          {
            root: true, 
          }
        );
        throw error;
      }
    }
  },
};
