import axios from "axios";
// eslint-disable-next-line import/no-cycle
import store from "../store/index";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 500000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("요청 시작");
    store.dispatch("toggleLoading", true);
    return config;
  },
  (error) => {
    // 요청 에러 발생 시 로딩 종료
    store.dispatch("toggleLoading", false);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch("toggleLoading", false);
    return response;
  },
  (error) => {
    console.log("API 에러:", error.response);
    // 응답 에러 발생 시 로딩 종료
    store.dispatch("toggleLoading", false);
    console.error("응답 에러:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
