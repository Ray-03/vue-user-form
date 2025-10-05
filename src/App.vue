<template>
  <div>
    <app-header
      v-model:view-mode="viewMode"
      v-model:search-query="searchQuery"
      v-model:gender-filter="genderFilter"
      v-model:sort-by="sortBy"
      v-model:dob-range="dobRange"
      v-model:created-at-range="createdAtRange"
      v-model:updated-at-range="updatedAtRange"
      @add="handleAdd"
      @export="exportToCSV"
      @clear-filters="clearAllFilters"
    />

    <div class="content">
      <user-list
        ref="userListRef"
        :view-mode="viewMode"
        :search-query="searchQuery"
        :gender-filter="genderFilter"
        :sort-by="sortBy"
        :dob-range="dobRange"
        :created-at-range="createdAtRange"
        :updated-at-range="updatedAtRange"
        @edit="handleEdit"
      />
    </div>

    <user-form-modal
      v-model:show="showFormModal"
      :user="selectedUser"
      @success="handleFormSuccess"
    />
  </div>
</template>

<style scoped>
.content {
  padding: 24px;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "./components/AppHeader.vue";
import UserList from "./components/UserView.vue";
import UserFormModal from "./components/UserForm.vue";
import { VIEW_MODE } from "./types/ViewMode";
import type { User } from "./stores/UserStore";
import { useExportCSV } from "./composables/useExportCSV";

const { exportToCSV: exportUsersToCSV } = useExportCSV();
const userListRef = ref<InstanceType<typeof UserList>>();
const viewMode = ref<VIEW_MODE>(VIEW_MODE.LIST);
const showFormModal = ref(false);
const selectedUser = ref<User | null>(null);

const searchQuery = ref("");
const genderFilter = ref<string | null>(null);
const sortBy = ref("createdAt-desc");
const dobRange = ref<[number, number] | null>(null);
const createdAtRange = ref<[number, number] | null>(null);
const updatedAtRange = ref<[number, number] | null>(null);

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

const clearAllFilters = () => {
  searchQuery.value = "";
  genderFilter.value = null;
  sortBy.value = "createdAt-desc";
  dobRange.value = null;
  createdAtRange.value = null;
  updatedAtRange.value = null;
};

const exportToCSV = () => {
  if (!userListRef.value) {
    alert("Unable to export data");
    return;
  }

  const users = userListRef.value.getFilteredUsers();
  exportUsersToCSV(users);
};
</script>
