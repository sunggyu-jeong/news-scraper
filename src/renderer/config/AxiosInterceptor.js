/* eslint-disable dot-notation */
import $router from "@/renderer/router/index";
import axios from "axios";
// eslint-disable-next-line import/no-cycle

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 500000,
  withCredentials: true,
});

let store = null;

export const setStore = (storeInstance) => {
  store = storeInstance;
};

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("요청 시작");
    store.dispatch("loading/toggleLoading", true);
    return config;
  },
  (error) => {
    // 요청 에러 발생 시 로딩 종료
    store.dispatch("loading/toggleLoading", false);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch("loading/toggleLoading", false);
    return response.data;
  },
  async (error) => {
    // 엑세스 토큰이 없거나 만료된 경우, 리프래시 요청
    if (error.response.data.status === 403) {
      try {
        const response = await axiosInstance.post("/api/user/refresh");
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        const { config } = error;
        config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        const baseResponse = await axiosInstance.request(config);
        return baseResponse;
      } catch (refreshError) {
        store.dispatch("setIsLogin", false);
        $router.replace("/login");
        store.dispatch("loading/toggleLoading", false);
        return Promise.reject(refreshError);
      }
    }
    // 리프래시 토큰이 없거나 만료된 경우, 로그아웃 처리
    if (error.response.data.status === 409) {
      $router.replace("/login");
      store.dispatch("loading/toggleLoading", false);
      return Promise.reject(error);
    }
    // 응답 에러 발생 시 로딩 종료
    store.dispatch("loading/toggleLoading", false);
    console.error("응답 에러:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
