/**
 * 주어진 값이 비어있는 지 확인합니다.
 *
 * @param {*} value - The value to check for emptiness.
 * @returns {boolean} Returns true if the value is considered empty, false otherwise.
 *
 * @description
 * 다양한 유형의 값을 확인하고 비어있음으로 간주되는 지 판단합니다.
 * - null or undefined
 * - Empty or whitespace-only strings
 * - Empty arrays
 * - Empty objects (excluding arrays)
 * - NaN or zero for numbers
 * - false for boolean values
 *
 * @example
 * isEmpty(null);             // returns true
 * isEmpty("");               // returns true
 * isEmpty("  ");             // returns true
 * isEmpty([]);               // returns true
 * isEmpty({});               // returns true
 * isEmpty(0);                // returns true
 * isEmpty(NaN);              // returns true
 * isEmpty(false);            // returns true
 * isEmpty("Hello");          // returns false
 * isEmpty([1, 2, 3]);        // returns false
 * isEmpty({ key: "value" }); // returns false
 * isEmpty(42);               // returns false
 * isEmpty(true);             // returns false
 */
export const isEmpty = (value) => {
  /** 주어진 값이 null이거나 undefined인 경우 */
  if (value === null || value === undefined) {
    return true;
  }
  /** 주어진 값이 문자열이고, 공백을 제거한 문자열이 빈값일 경우 */
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  /** 주어진 값이 배열이고, 배열의 길이가 0일 경우 */
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  /** 주어진 값이 객체이고, 객체의 데이터가 빈 경우 */
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
    return true;
  }
  /** 주어진 값이 숫자이고, Nan 또는 0일 경우 */
  if (typeof value === "number" && (Number.isNaN(value) === true || value === 0)) {
    return true;
  }
  /** 주어진 값이 불리언 이고, 값이 false일 경우 */
  if (typeof value === "boolean" && value === false) {
    return true;
  }
  /** 위 주어진 케이스가 아닐경우, 값이 있다고 판단 */
  return false;
};

/**
 * 지정된 시간 후에 실행 되는 Promise를 생성합니다.
 *
 * @param {number} timeout - Promise가 해결되기 전에 대기할 밀리초 단위의 시간.
 * @returns {Promise<void>} 지정된 시간 후에 해결되는 Promise.
 *
 */
export const waitForTimeout = (timeout) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

/**
 * 이전 화면으로 이동
 * step: 이전 화면으로 이동할 depth 갯수. 기본값은 -1.
 * step > 0이면 기본값으로 -1을 사용하고, 음수일 경우 그 값만큼 이동.
 *
 * @example
 * goBack(): 직전화면 이동, goBack(-2): 2단계 전 화면 이동
 *
 * @caution
 * 반드시 라우터를 사용하는 곳에서 주입한 후에 사용할 것
 */
export const navigateToPreviousPage = (router, step = -1) => {
  let stepValue = step;
  // step이 음수가 아니면 기본값 -1을 설정
  if (typeof step !== "number" || step >= 0) {
    stepValue = -1;
  }
  // $router.go()에 step 값으로 이동
  router.go(stepValue);
};

export const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
