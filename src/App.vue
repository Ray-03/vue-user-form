<template>
  <div>
    <div class="sticky-header">
      <div class="header-content">
        <h1 style="margin: 0">User Management System</h1>
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon>
                <AddOutlined />
              </n-icon>
            </template>
            Add User
          </n-button>
          <n-button-group>
            <n-button
              :type="viewMode === VIEW_MODE.LIST ? 'primary' : 'default'"
              @click="viewMode = VIEW_MODE.LIST"
            >
              <template #icon>
                <n-icon>
                  <ListAltOutlined />
                </n-icon>
              </template>
            </n-button>
            <n-button
              :type="viewMode === VIEW_MODE.GRID ? 'primary' : 'default'"
              @click="viewMode = VIEW_MODE.GRID"
            >
              <template #icon>
                <n-icon>
                  <GridViewOutlined />
                </n-icon>
              </template>
            </n-button>
          </n-button-group>
        </n-space>
      </div>
      <n-divider style="margin: 0" />
    </div>

    <div class="content">
      <user-list :view-mode="viewMode" @add="handleAdd" @edit="handleEdit" />
    </div>

    <user-form-modal
      v-model:show="showFormModal"
      :user="selectedUser"
      @success="handleFormSuccess"
    />
  </div>
</template>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  padding: 24px 24px 0 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.content {
  padding: 24px;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import UserList from "./components/UserView.vue";
import UserFormModal from "./components/UserForm.vue";
import {
  ListAltOutlined,
  GridViewOutlined,
  AddOutlined,
} from "@vicons/material";
import { VIEW_MODE } from "./types/ViewMode";
import type { User } from "./stores/UserStore";

const viewMode = ref<VIEW_MODE>(VIEW_MODE.LIST);
const showFormModal = ref(false);
const selectedUser = ref<User | null>(null);

const handleAdd = () => {
  selectedUser.value = null;
  showFormModal.value = true;
};

const handleEdit = (user: User) => {
  selectedUser.value = user;
  showFormModal.value = true;
};

const handleFormSuccess = () => {
  selectedUser.value = null;
};
</script>
