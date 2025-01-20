import { computed } from "vue";
import { useStore } from "vuex";

/**
 * 뉴스 데이터를 관리하기 위한 커스텀 컴포저블.
 *
 * @returns {Object} - 다음을 포함하는 컴포저블 객체:
 *   @returns {ComputedRef<Array>} newsList - 뉴스 목록에 대한 계산된 참조.
 *   @returns {Function} fetchNews - 검색어와 날짜 범위에 따라 뉴스를 조회하는 함수
 */
const useNews = () => {
  // vuex store instance
  const store = useStore();
  // 뉴스 저장소 정보
  const newsList = computed(() => store.getters["news/getNewsList"]);

  /**
   * 뉴스 조회
   *
   * @param {String} queries 검색어
   * @param {String} startDate 검색 시작일
   * @param {String} endDate 검색 종료일
   */
  const fetchNews = async (queries, startDate, endDate) => {
    await store.dispatch("news/fetchNews", { queries, startDate, endDate });
  };

  return {
    newsList,
    fetchNews,
  };
};

export default useNews;
