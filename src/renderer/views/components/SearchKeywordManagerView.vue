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
  </div>
</template>

<script setup>
import { computed, onMounted, ref, unref, watch } from "vue";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons-vue";
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
 * 삭제모달 표출
 *
 * @param visible 모달 팝업 표시 여부
 *
 */
const handleVisibleDeleteModal = (visible) => {
  console.log(">>>>>>>");
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
  console.log(">>>>>>> deleteKeywords", selectedRowKeys.value);
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
</style>
