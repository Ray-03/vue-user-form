<template>
  <n-card title="User List">
    <template #header-extra>
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
    </template>

    <n-spin :show="loading">
      <n-empty v-if="!users.length && !loading" description="No users yet" />

      <n-list v-else-if="viewMode === VIEW_MODE.LIST">
        <user-item
          v-for="user in users"
          :key="user.id"
          :user="user"
          :view-mode="viewMode"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </n-list>

      <div v-else class="grid-container">
        <user-item
          v-for="user in users"
          :key="user.id"
          :user="user"
          :view-mode="viewMode"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </div>
    </n-spin>
  </n-card>

  <user-form-modal
    v-model:show="showFormModal"
    :user="selectedUser"
    @success="handleFormSuccess"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore, type User } from "../stores/UserStore";
import UserItem from "./UserItem.vue";
import UserFormModal from "./UserForm.vue";
import {
  ListAltOutlined,
  GridViewOutlined,
  AddOutlined,
} from "@vicons/material";
import { VIEW_MODE } from "../types/ViewMode";

const userStore = useUserStore();
const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);
const viewMode = ref<VIEW_MODE>(VIEW_MODE.LIST);

const showFormModal = ref(false);
const selectedUser = ref<User | null>(null);

onMounted(() => {
  userStore.fetchUsers();
});

const handleDelete = (id: string) => userStore.deleteUser(id);

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

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
</style>
