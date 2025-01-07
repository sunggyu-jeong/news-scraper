import axios from "axios";
import store from "../store/index";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
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

axiosInstance.interceptors.response.use((response) => {
  store.dispatch("toggleLoading", false);
  return response;
});

export default axiosInstance;
