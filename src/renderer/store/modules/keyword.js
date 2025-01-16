import dayjs from "dayjs";
import axiosInstance from "../../config/AxiosInterceptor";

export default {
  namespaced: true,
  state: {
    isLoading: null,
    keywordList: [],
  },
  getters: {
    getisLoading: (state) => state.isLoading,
    getKeywordList: (state) => state.getKeywordList,
  },
  mutations: {
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setKeywordList(state, keywordList) {
      state.keywordList = keywordList;
    },
  },
  actions: {
    async fetchKeywordList({ commit }) {
      try {
        commit("setIsLoading", true);
        const response = await axiosInstance.get("/api/keywords");
        commit(
          "setKeywordList",
          response.data.map((el) => ({
            key: el.keywordId,
            keyword: el.keyword,
            createdAt: dayjs(el.createdAt).format("YY.MM.DD HH:mm:ss"),
          }))
        );
      } catch (error) {
        console.error(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message ||
            "검색어 조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요.",
          {
            root: true,
          }
        );
      } finally {
        commit("setIsLoading", false);
      }
    },
    async deleteKeywords({ commit }, keywordIdList) {
      try {
        await axiosInstance.delete(`/api/keywords`, {
          params: { keywordIds: keywordIdList }, // params에 키워드 배열을 keywordIds로 넣기
          paramsSerializer: (params) => {
            let queryString = "";
            Object.keys(params).forEach((key) => {
              if (Array.isArray(params[key])) {
                // 배열을 [] 형식으로 직렬화
                queryString += params[key]
                  .map((value) => `${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`)
                  .join("&");
              } else {
                queryString += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
              }
            });
            return queryString;
          },
        });
        return true;
      } catch (error) {
        console.log(error);
        commit(
          "setErrorMessage",
          error.response?.data?.message ||
            "키워드 삭제 요청이 실패했습니다. 잠시 후 다시 시도해주세요.",
          {
            root: true,
          }
        );
        return false;
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
