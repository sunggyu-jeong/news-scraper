<template>
  <SubHeader title="검색설정" />
  <div class="keyword">
    <div class="keyword-date-picker">
      <h3>검색기간</h3>
      <div className="date-picker">
        <a-range-picker
          v-model:value="selectedPicker"
          :disabled-date="disabledDate"
          :allowClear="false"
        />
      </div>
    </div>
    <div v-if="isLoading">
      <a-skeleton
        v-for="n in 5"
        :key="n"
        :active="true"
        :row="10"
        :title="false"
        :paragraph="{ rows: 3 }"
      />
    </div>
    <a-table
      v-else
      class="keyword-content"
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="keywordList"
      :pagination="false"
    />
    <a-float-button-group shape="circle" class="floating-group">
      <a-float-button
        type="default"
        :style="{
          right: '24px',
        }"
        @click="handleVisibleAddModal(true)"
      >
        <div slot="tooltip">
          <div>검색어 추가하기</div>
        </div>
        <div slot="icon">
          <PlusCircleOutlined />
        </div>
      </a-float-button>
      <a-float-button
        :badge="{ count: selectedKeywordCount, overflowCount: 999 }"
        @click="handleVisibleDeleteModal(true)"
      >
        <div slot="tooltip">
          <div>검색어 삭제하기</div>
        </div>
        <div slot="icon">
          <DeleteOutlined />
        </div>
      </a-float-button>
    </a-float-button-group>
    <a-modal
      v-model:open="openDeleteModal"
      title="검색어 삭제"
      ok-text="삭제"
      cancel-text="취소"
      width="400px"
      @ok="handleDeleteKeywords"
    >
      <span>
        <p>선택하신 {{ selectedKeywordCount }}개의 검색어를 즉시 삭제하시겠습니까?</p>
        <p>이 작업은 취소할 수 없습니다.</p>
      </span>
    </a-modal>

    <a-modal
      v-model:open="openAddModal"
      title="검색어 추가"
      ok-text="저장"
      cancel-text="취소"
      width="400px"
      @ok="handlePostKeywords"
    >
      <span>
        <a-button
          class="keyword-button"
          v-for="(keyword, index) in inputKeywordList"
          :key="index"
          @click="onClickRemoveKeyword(index)"
        >
          {{ keyword }}
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>

        <a-input
          class="keyword-input"
          v-model:value="inputKeyword"
          placeholder="검색어를 입력하세요"
          @keydown.enter.prevent="handleAddKeyword"
          maxlength="20"
        />
        <span class="keyword-input-guide">추가하실 검색어를 입력 한 후에 엔터를 눌러주세요.</span>
      </span>
    </a-modal>

    <a-button class="fixed-bottom-button" type="primary" shape="round" @click="handleSearch">
      검색
      <ArrowRightOutlined />
    </a-button>
  </div>
  <TabbarView />
</template>

<script setup>
import { computed, onMounted, ref, unref, watch } from "vue";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { isEmpty } from "@/shared/utils.js";
import useNews from "@/renderer/composables/useNews.js";
import SubHeader from "../../shared-components/layout/SubHeader.vue";
import TabbarView from "@/renderer/components/TabbarView.vue";

// 검색어 정보 조회 로딩여부
const isLoading = ref(false);
// 선택한 검색어 정보
const selectedRowKeys = ref([]);
// vuex
const store = useStore();
// 검색어 목록
const keywordList = computed(() => store.state.keyword.keywordList);
// 선택한 검색어 갯수
const selectedKeywordCount = computed(() => {
  return selectedRowKeys.value ? selectedRowKeys.value.length : 0;
});
// 삭제 모달팝업 표출 여부
const openDeleteModal = ref(false);
// 등록 모달팝업 표출 여부
const openAddModal = ref(false);
// 입력 검색어 목록
const inputKeywordList = ref([]);
// 현재 입력한 검색어
const inputKeyword = ref("");
// 선택한 기간의 시작일과 종료일을 저장하는 변수
const selectedPicker = ref([dayjs().add(-1, "day"), dayjs()]);
// Vue Router를 가져옵니다.
const router = useRouter();
// 검색된 뉴스 정보
const { newsList, fetchNews } = useNews();

// 테이블 컬럼
const columns = [
  {
    title: "검색어",
    dataIndex: "keyword",
    key: "keyword",
  },
  {
    title: "생성일",
    dataIndex: "createdAt",
    key: "createdAt",
    textAlign: "center",
  },
];
/**
 * 비활성화 할 날짜 설정
 *
 * @param current 현재 날짜
 */
const disabledDate = (current) => current && current > dayjs().endOf("day");

/**
 * 검색어 등록
 */
const handleAddKeyword = (e) => {
  if (e.isComposing) {
    console.log(">>> composing");
    return;
  }
  if (isEmpty(inputKeyword.value)) {
    message.warn("검색어를 입력하세요.");
    return;
  }
  console.log(">>>>>>>>>>>>>", inputKeyword.value);
  inputKeywordList.value.push(inputKeyword.value);
  inputKeyword.value = "";
};

/**
 * 입력한 키워드 등록
 */
const handlePostKeywords = async () => {
  if (isEmpty(inputKeywordList.value)) {
    message.warn("입력된 검색어가 없습니다.");
    return;
  }
  const response = await store.dispatch("keyword/postKeywords", inputKeywordList.value);
  if (response) {
    message.success("검색어 등록이 완료되었습니다.");
    openAddModal.value = false;
    store.dispatch("keyword/fetchKeywordList");
  }
};

/**
 * 검색어 등록 모달 표출정보 변경
 *
 * @param visible 모달 팝업 표시 여부
 */
const handleVisibleAddModal = (visible) => {
  openAddModal.value = visible;
};

/**
 * 입력한 검색어 삭제
 *
 * @param index 검색어 인덱스
 */
const onClickRemoveKeyword = (index) => {
  console.log(">>>>>>>>>>>>", index);
  inputKeywordList.value = inputKeywordList.value.filter(
    (el) => el !== inputKeywordList.value[index]
  );
};

/**
 * 검색어 삭제 모달 표출
 *
 * @param visible 모달 팝업 표시 여부
 *
 */
const handleVisibleDeleteModal = (visible) => {
  if (isEmpty(selectedRowKeys.value)) {
    message.warn("선택한 검색어가 없습니다.");
    return;
  }
  openDeleteModal.value = visible;
};

/**
 * 선택한 검색어 삭제
 */
const handleDeleteKeywords = async () => {
  const response = await store.dispatch("keyword/deleteKeywords", selectedRowKeys.value);
  if (response) {
    message.success("검색어가 삭제되었습니다.");
    selectedRowKeys.value = [];
    isLoading.value = true;
    store.dispatch("keyword/fetchKeywordList");
  }
  openDeleteModal.value = false;
};

/**
 * 검색어 선택 처리
 */
const onSelectChange = (changableRowKeys) => {
  console.log("selectedRowKeys changed: ", changableRowKeys);
  selectedRowKeys.value = changableRowKeys;
};

/**
 * 컬럼 선택 객체
 *
 * @return { selectedRowKeys, onChange, hideDefaultSelections, columnWidth }
 */
const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: onSelectChange,
  hideDefaultSelections: true,
  columnWidth: 70,
}));

/**
 * 선택한 검색어, 기간으로 검색 요청
 *
 * @async
 * @function handleSearch
 */
const handleSearch = async () => {
  const selectedKey = new Set(selectedRowKeys.value);
  // 선택한 검색어만 찾는 변수
  const searchQuery = keywordList.value
    .filter((el) => selectedKey.has(el.key))
    .map((el) => el.keyword)
    .join(",");
  await fetchNews(
    searchQuery,
    dayjs(selectedPicker.value[0]).format("YYYY.MM.DD"),
    dayjs(selectedPicker.value[1]).format("YYYY.MM.DD")
  );
};

onMounted(() => {
  if (!isEmpty(keywordList.value)) {
    selectedRowKeys.value = keywordList.value.map((el) => el.key);
    return;
  }

  isLoading.value = true;
  store.dispatch("keyword/fetchKeywordList");
});

watch(keywordList, (newkeywordList) => {
  isLoading.value = false;
  if (!isEmpty(newkeywordList)) {
    selectedRowKeys.value = newkeywordList.map((el) => el.key);
  }
});

watch(openAddModal, (modalStatus) => {
  if (!modalStatus) {
    inputKeyword.value = "";
    inputKeywordList.value = [];
  }
});

watch(newsList, (searchNewsList) => {
  console.log(">>>>>>>");
  if (isEmpty(searchNewsList.length)) {
    message.warning("검색된 정보가 없습니다.");
    return;
  }
  router.push({
    path: "/results",
    query: {
      startDate: dayjs(selectedPicker.value[0]).format("YYYY.MM.DD"),
      endDate: dayjs(selectedPicker.value[1]).format("YYYY.MM.DD"),
    },
  });
});
</script>

<style lang="sass" scoped>
.delete-content {
  margin-top: 50px;
  text-align: end;
  margin-right: 16px;
}
.keyword {
  margin-top: 40px;
  margin-bottom: 80px;
  .keyword-content {
    padding-bottom: 75px;
    .ant-spin-container .ant-table-container .ant-table-content {
      .ant-table-thead {
        > tr th {
          text-align: center;
          font-family: sans-serif;
          font-size: 14px;
          font-weight: bold;
        }
      }
      .ant-table-tbody {
      > tr td {
          text-align: center;
          font-family: sans-serif;
          font-size: 13px;
          font-weight: normal;
        }
      }
    }
  }
}

.keyword-button {
  margin-right: 8px;
  margin-bottom: 8px;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.keyword-input {
  width: 100%;
  margin-bottom: 4px;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 8px;
  color: #495057;
  background-color: #f8f9fa;
  &:focus {
    outline: none;
    background-color:  #e9ecef;
  }
}
.keyword-date-picker {
  margin-left: 16px;
  display: flex;
  align-items: start;
  flex-direction: column;
  margin-bottom: 8px;
  h3 {
    margin:0px;
    margin-top: 16px;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: bold;
  }
  .date-picker {
    margin-top: 12px;
    margin-left: -9px;
    .ant-picker {
      border: none;

      .ant-picker-suffix {
        display: none;
      }
    }
  }
}
.keyword-input-guide {
  color: #6c757d;
  font-size: 11px;
  margin-left: 5px;
}

.floating-group {
  margin-bottom: 48px;
}

.fixed-bottom-button {
  position: fixed;
  bottom:100px;
  left: 50%;
  height: 40px;
  transform: translateX(-50%);
  z-index: 9999;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
}
</style>
