<template>
  <SubHeader :title="isTitleVisible ? '업무 자동화 시스템 사용자 관리' : ''" />
  <div class="content">
    <div class="title_manual_batch">
      <h2 class="title">업무 자동화 시스템 사용자 관리</h2>
      <a-button type="primary" class="batch_manual_button" @click="openManualBatchModal">
        배치 수동실행
      </a-button>
    </div>
    <div class="separator" />
    <div class="user_content">
      <h4 class="user_title">사용자 목록</h4>
      <div class="user_search">
        <a-input class="user_search_name" v-model:value="inputName" placeholder="사용자 검색">
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <a-button type="primary" class="user_search_button" @click="openAddModal">
          <template #prefix><PlusOutlined /></template>
          사용자 추가
        </a-button>
      </div>
    </div>
    <div class="user_table">
      <a-table
        :columns="columns"
        :dataSource="batchUserList"
        :rowKey="record => record.id"
        :pagination="{ pageSize: 10 }"
      >
        <template #action="{ text, record }">
          <a-button type="link" @click="openEditModal(record)">수정</a-button>
        </template>
        <template #delete="{ record }">
          <a-popconfirm
            title="사용자를 삭제하시겠습니까?<br/> 이 작업은 되돌릴 수 없습니다."
            ok-text="예"
            cancel-text="아니오"
            @confirm="deleteUser(record)"
          >
            <a href="#" style="color: red">삭제</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
  <a-modal
    v-model:visible="isModalOpen"
    :title="isEditMode ? '사용자 수정' : '새 사용자 등록'"
    @ok="handleOk"
    @cancel="() => (isModalOpen = false)"
  >
    <a-form layout="vertical">
      <a-form-item label="이름">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="이메일">
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item label="수신 유형">
        <a-select v-model:value="formState.recipientType">
          <a-select-option value="TO">TO: 주 업무 담당자</a-select-option>
          <a-select-option value="CC">CC: 메일 참조</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="isBatchModalOpen"
    :title="'배치 수동실행'"
    centered
    width="400"
    :footer="null"
    @cancel="() => (isBatchModalOpen = false)"
  >
    <div class="batch-modal-content">
      <a-space direction="vertical" size="middle" style="width: 100%">
        <a-popconfirm
          ok-text="예"
          cancel-text="아니오"
          @confirm="manualBatch('newsBatchJob')"
        >
          <template #title>
            배치를 수동으로 실행하시겠습니까?<br/>
            하기 기재된 사용자의 이메일로 수집된 정보가 전달되며,<br/>
            이 작업은 오랜 시간이 소요됩니다.
          </template>
          <a-button type="text" block>
            검색어로 뉴스 정보 조회 배치
          </a-button>
        </a-popconfirm>

        <a-popconfirm
          ok-text="예"
          cancel-text="아니오"
          @confirm="manualBatch('publicBatchJob')"
        >
          <template #title>
            배치를 수동으로 실행하시겠습니까?<br/>
            서버에 저장된 공휴일 정보가 갱신됩니다.<br/>
            이 작업은 오랜 시간이 소요됩니다.
          </template>
          <a-button type="text" block>
            공휴일 정보 조회
          </a-button>
        </a-popconfirm>
      </a-space>
    </div>
  </a-modal>
  <TabbarView />
</template>
<script setup>
import TabbarView from "@/renderer/components/TabbarView.vue";
import SubHeader from "@/renderer/shared-components/layout/SubHeader.vue";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons-vue";
import dayjs from 'dayjs';
import { useStore } from 'vuex';
import { computed, ref, reactive, onMounted, watch } from 'vue';
import { Table as ATable, Modal as AModal, Form as AForm, Input as AInput, Select as ASelect, message, Space as ASpace } from 'ant-design-vue';

const isTitleVisible = ref(false);
const inputName = ref("");
const store = useStore();
const batchUserList = computed(() => store.state.batchUser.batchUserList);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const formState = reactive({
  id: null,
  name: '',
  email: '',
  recipientType: 'TO'
});
const isBatchModalOpen = ref(false);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '이름', dataIndex: 'name', key: 'name' },
  { title: '이메일', dataIndex: 'email', key: 'email' },
  { title: '수신유형', dataIndex: 'recipientType', key: 'recipientType' },
  {
    title: '생성일',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: ({ text }) => dayjs(text).format('YYYY년 M월 D일 H시 m분 s초')
  },
  {
    title: '수정일',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    customRender: ({ text }) => dayjs(text).format('YYYY년 M월 D일 H시 m분 s초')
  },
  {
    title: '수정하기',
    key: 'action',
    slots: { customRender: 'action' }
  },
  {
    title: '삭제하기',
    key: 'delete',
    slots: { customRender: 'delete' }
  }
];
const openAddModal = () => {
  isEditMode.value = false;
  Object.assign(formState, { id: null, name: '', email: '', recipientType: 'TO' });
  isModalOpen.value = true;
};
const openEditModal = (record) => {
  isEditMode.value = true;
  Object.assign(formState, {
    id: record.id,
    name: record.name,
    email: record.email,
    recipientType: record.recipientType
  });
  isModalOpen.value = true;
};
const openManualBatchModal = () => {
  isBatchModalOpen.value = true;
}

const handleOk = async (record) => {
  try {
    if (isEditMode.value) {
      // 수정 API 호출
      console.log(formState)
      const request = {
        "id": formState.id,
        "email": formState.email,
        "nName": formState.name,
        "nEmail": formState.email,
        "nRecipientType": formState.recipientType
      }
      await store.dispatch("batchUser/updateBatchUser", request);
      message.success('사용자 정보가 수정되었습니다.');
    } else {
      const request = {
        name: formState.name,
        email: formState.email,
        recipientType: formState.recipientType
      }
      await store.dispatch("batchUser/addBatchUser", request);
      message.success('새로운 사용자가 등록되었습니다.');
    }
    store.dispatch('batchUser/getBatchUser');
    isModalOpen.value = false;
  } catch (error) {
    console.log(error.response);
  }
};

const deleteUser = async (record) => {
  try {
    console.log(">>>>>,", record)
    store.dispatch("batchUser/deleteUser", record.id);
    message.success('사용자가 삭제되었습니다.');
    store.dispatch('batchUser/getBatchUser');
  } catch (error) {
    console.log(error.response);
  }
};

const manualBatch = async (jobName) => {
  try {
    await store.dispatch("batchUser/manualBatch", jobName);
    message.success("배치 수동실행 요청이 완료되었습니다.")
  } catch(error) {
    console.log(error.message);
  }
}

const handleScroll = () => {
  isTitleVisible.value = window.scrollY >= 70;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  store.dispatch('batchUser/getBatchUser');
});
</script>

<style lang="scss" scoped>
.content {
  margin: 70px 24px 0px 24px;
    .title_manual_batch {
      display: flex;
      align-items: center;
      justify-content: space-between;
    .title {
      font-size: 24px;
      text-align: start;
    }
  }
  .separator {
    margin: 24px 0px 24px;
    border-bottom: 1px solid #ddd;
  }
  .user_content {
    display: flex;
    justify-content: space-between;
    .user_title {
      font-size: 18px;
      margin: 0;
      display: flex;
      align-items: center;
    }
    .user_search {
      align-items: center;
      display: flex;
      gap: 8px;
      .user_search_name {
        height: 40px;
        border-radius: 0%;
      }
    }
  }
  .user_table {
    margin-top: 24px;
  }
}
.batch-modal-content {
  padding: 16px;
}
</style>
