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
          <n-button @click="exportToCSV">
            <template #icon>
              <n-icon>
                <DownloadOutlined />
              </n-icon>
            </template>
            Export to CSV
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

      <div class="filter-bar">
        <n-space vertical :size="12">
          <n-space>
            <n-input
              v-model:value="searchQuery"
              placeholder="Search by name or email"
              clearable
              style="width: 300px"
            >
              <template #prefix>
                <n-icon>
                  <SearchOutlined />
                </n-icon>
              </template>
            </n-input>

            <n-select
              v-model:value="genderFilter"
              placeholder="Filter by gender"
              clearable
              :options="genderOptions"
              style="width: 150px"
            />

            <n-select
              v-model:value="sortBy"
              placeholder="Sort by"
              :options="sortOptions"
              style="width: 180px"
            />

            <n-button @click="showAdvancedFilters = !showAdvancedFilters">
              {{ showAdvancedFilters ? "Hide" : "Show" }} Advanced Filters
            </n-button>

            <n-button secondary @click="clearAllFilters">Clear All</n-button>
          </n-space>

          <n-collapse-transition :show="showAdvancedFilters">
            <n-card size="small" title="Advanced Filters">
              <n-space vertical :size="12">
                <n-space align="center">
                  <span style="width: 100px">DOB Range:</span>
                  <n-date-picker
                    v-model:value="dobRange"
                    type="daterange"
                    clearable
                    style="width: 300px"
                  />
                </n-space>

                <n-space align="center">
                  <span style="width: 100px">Created:</span>
                  <n-date-picker
                    v-model:value="createdAtRange"
                    type="datetimerange"
                    clearable
                    style="width: 400px"
                  />
                </n-space>

                <n-space align="center">
                  <span style="width: 100px">Updated:</span>
                  <n-date-picker
                    v-model:value="updatedAtRange"
                    type="datetimerange"
                    clearable
                    style="width: 400px"
                  />
                </n-space>
              </n-space>
            </n-card>
          </n-collapse-transition>
        </n-space>
      </div>
    </div>

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
        @add="handleAdd"
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

.filter-bar {
  padding: 16px 0;
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
  SearchOutlined,
  DownloadOutlined,
} from "@vicons/material";
import { VIEW_MODE } from "./types/ViewMode";
import type { User } from "./stores/UserStore";
import { useExportCSV } from "./composables/useExportCSV";

const { exportToCSV: exportUsersToCSV } = useExportCSV();
const userListRef = ref<InstanceType<typeof UserList>>();
const viewMode = ref<VIEW_MODE>(VIEW_MODE.LIST);
const showFormModal = ref(false);
const selectedUser = ref<User | null>(null);
const showAdvancedFilters = ref(false);

const searchQuery = ref("");
const genderFilter = ref<string | null>(null);
const sortBy = ref("createdAt-desc");
const dobRange = ref<[number, number] | null>(null);
const createdAtRange = ref<[number, number] | null>(null);
const updatedAtRange = ref<[number, number] | null>(null);

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const sortOptions = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Email (A-Z)", value: "email-asc" },
  { label: "Email (Z-A)", value: "email-desc" },
  { label: "DOB (Youngest)", value: "dob-desc" },
  { label: "DOB (Oldest)", value: "dob-asc" },
  { label: "Gender (A-Z)", value: "gender-asc" },
  { label: "Gender (Z-A)", value: "gender-desc" },
  { label: "Created (Newest)", value: "createdAt-desc" },
  { label: "Created (Oldest)", value: "createdAt-asc" },
  { label: "Updated (Newest)", value: "updatedAt-desc" },
  { label: "Updated (Oldest)", value: "updatedAt-asc" },
];

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
