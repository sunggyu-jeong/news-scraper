<template>
  <SubHeader title="키워드" />
  <div class="delete-content">
    <a-popconfirm
      title="선택하신 검색어를 삭제하시겠습니까?"
      ok-text="예"
      cancel-text="아니오"
      @confirm="confirm"
    >
      <a-button class="delete-button">선택 삭제</a-button>
    </a-popconfirm>
  </div>
  <div class="keyword">
    <a-skeleton v-if="isLoading" :active="true" :row="10" :title="false" :paragraph="{ rows: 3 }" />
    <a-table
      v-else
      class="keyword-content"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :pagination="false"
    />
  </div>
  <!-- <a-float-button :badge="{ count: 123, overflowCount: 999 }"> -->

  <!-- </a-float-button> -->
</template>

<script setup>
import { computed, ref, unref } from "vue";
import { Table } from "ant-design-vue";
import SubHeader from "../../shared-components/layout/SubHeader.vue";

const isLoading = ref(true);
const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [];
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
const selectedRowKeys = ref([]); // Check here to configure the default column

const confirm = () => {};
const onSelectChange = (changableRowKeys) => {
  console.log("selectedRowKeys changed: ", changableRowKeys);
  selectedRowKeys.value = changableRowKeys;
};
// eslint-disable-next-line arrow-body-style
const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
    ],
  };
});
</script>

<style lang="sass">
.delete-content {
  margin-top: 50px;
  text-align: end;
  margin-right: 16px;
  :where(.css-dev-only-do-not-override-1p3hq3p).ant-btn-default:not(:disabled):hover {
    color: #FAAC14 !important;
  }
  .delete-button {

    background-color: #383d42;
    font-family: sans-serif;
    font-size: 13px;
    font-weight: bold;
    color: #FFF;
    border: none;
    border-radius: 5px;
    padding: 0px 15px;
    cursor: pointer;
    :not(:disabled):hover {
      color: #FAAC14
    }
  }
}
.keyword {
  margin-top: 10px;
  margin-bottom: 80px;
}
</style>
