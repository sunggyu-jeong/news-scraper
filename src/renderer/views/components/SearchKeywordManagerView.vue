<template>
  <SubHeader title="검색 키워드" />
  <div class="keyword">
    <template v-if="isLoading">
      <a-skeleton
        v-for="n in 5"
        :key="n"
        :active="true"
        :row="10"
        :title="false"
        :paragraph="{ rows: 3 }"
      />
    </template>
    <a-table
      v-else
      class="keyword-content"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="keywordList"
      :pagination="false"
    />
    <a-float-button-group shape="circle">
      <a-float-button
        type="default"
        :style="{
          right: '24px',
        }"
        @click="handleVisibleAddModal(true)"
      >
        <template #tooltip>
          <div>키워드 추가하기</div>
        </template>
        <template #icon> <PlusCircleOutlined /> </template>
      </a-float-button>
      <a-float-button
        :badge="{ count: selectedKeywordCount, overflowCount: 999 }"
        @click="handleVisibleDeleteModal(true)"
      >
        <template #tooltip>
          <div>키워드 삭제하기</div>
        </template>
        <template #icon>
          <DeleteOutlined />
        </template>
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
          @keydown.enter.prevent="handleAddKeyword(e)"
        />
      </span>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, unref, watch } from "vue";
import { PlusCircleOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { isEmpty } from "@/shared/utils";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import SubHeader from "../../shared-components/layout/SubHeader.vue";

// 검색어 정보 조회 로딩여부
const isLoading = ref(false);
// 선택한 검색어 정보
const selectedRowKeys = ref([]);
// vuex
const store = useStore();
// 키워드 목록
const keywordList = computed(() => store.state.keyword.keywordList);
// 선택한 키워드 갯수
const selectedKeywordCount = computed(() => {
  return selectedRowKeys.value ? selectedRowKeys.value.length : 0;
});
// 삭제 모달팝업 표출 여부
const openDeleteModal = ref(false);
// 등록 모달팝업 표출 여부
const openAddModal = ref(true);
// 입력 키워드 목록
const inputKeywordList = ref([]);
// 현재 입력한 키워드
const inputKeyword = ref("");
// 테이블 컬럼
const columns = [
  {
    title: "키워드",
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
 * 키워드 등록
 */
const handleAddKeyword = (e) => {
  console.log(e);
  if (isEmpty(inputKeyword.value)) {
    message.warn("검색어를 입력하세요.");
    return;
  }
  console.log(">>>>>>>>>>>>>", inputKeyword.value);
  inputKeywordList.value.push(inputKeyword.value);
  inputKeyword.value = "";
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
 * 키워드 삭제 모달 표출
 *
 * @param visible 모달 팝업 표시 여부
 *
 */
const handleVisibleDeleteModal = (visible) => {
  if (isEmpty(selectedRowKeys.value)) {
    message.warn("선택한 키워드가 없습니다.");
    return;
  }
  openDeleteModal.value = visible;
};

/**
 * 선택한 키워드 삭제
 */
const handleDeleteKeywords = async () => {
  const response = await store.dispatch("keyword/deleteKeywords", selectedRowKeys.value);
  if (response) {
    message.success("키워드가 삭제되었습니다.");
    isLoading.value = true;
    store.dispatch("keyword/fetchKeywordList");
  }
  openDeleteModal.value = false;
};

/**
 * 키워드 선택 처리
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

onMounted(() => {
  isLoading.value = true;
  store.dispatch("keyword/fetchKeywordList");
});

watch(keywordList, (newkeywordList) => {
  isLoading.value = false;
  if (!isEmpty(newkeywordList)) {
    console.log("newKeywords: ", newkeywordList);
    console.log(dayjs(newkeywordList[0].createdAt).format("YYYY.MM.DD"));
    selectedRowKeys.value = newkeywordList.map((el) => el.key);
  }
});
</script>

<style lang="sass">
.delete-content {
  margin-top: 50px;
  text-align: end;
  margin-right: 16px;
}
.keyword {
  margin-top: 40px;
  margin-bottom: 80px;
  .keyword-content .ant-spin-container .ant-table-container .ant-table-content {
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
  margin-bottom: 8px;
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
    background-color: #e9ecef;
  }
}
</style>
