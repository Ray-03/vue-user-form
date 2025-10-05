<template>
  <div class="sticky-header">
    <div class="header-content">
      <h1 style="margin: 0">User Management System</h1>
      <n-space>
        <n-button type="primary" @click="$emit('add')">
          <template #icon>
            <n-icon>
              <AddOutlined />
            </n-icon>
          </template>
          Add User
        </n-button>
        <n-button @click="$emit('export')">
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
            @click="$emit('update:viewMode', VIEW_MODE.LIST)"
          >
            <template #icon>
              <n-icon>
                <ListAltOutlined />
              </n-icon>
            </template>
          </n-button>
          <n-button
            :type="viewMode === VIEW_MODE.GRID ? 'primary' : 'default'"
            @click="$emit('update:viewMode', VIEW_MODE.GRID)"
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
            :value="searchQuery"
            @update:value="$emit('update:searchQuery', $event)"
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
            :value="genderFilter"
            @update:value="$emit('update:genderFilter', $event)"
            placeholder="Filter by gender"
            clearable
            :options="genderOptions"
            style="width: 150px"
          />

          <n-select
            :value="sortBy"
            @update:value="$emit('update:sortBy', $event)"
            placeholder="Sort by"
            :options="sortOptions"
            style="width: 180px"
          />

          <n-button @click="showAdvancedFilters = !showAdvancedFilters">
            {{ showAdvancedFilters ? "Hide" : "Show" }} Advanced Filters
          </n-button>

          <n-button secondary @click="$emit('clearFilters')"
            >Clear All</n-button
          >
        </n-space>

        <n-collapse-transition :show="showAdvancedFilters">
          <n-card size="small" title="Advanced Filters">
            <n-space vertical :size="12">
              <n-space align="center">
                <span style="width: 100px">DOB Range:</span>
                <n-date-picker
                  :value="dobRange"
                  @update:value="$emit('update:dobRange', $event)"
                  type="daterange"
                  clearable
                  style="width: 300px"
                />
              </n-space>

              <n-space align="center">
                <span style="width: 100px">Created:</span>
                <n-date-picker
                  :value="createdAtRange"
                  @update:value="$emit('update:createdAtRange', $event)"
                  type="datetimerange"
                  clearable
                  style="width: 400px"
                />
              </n-space>

              <n-space align="center">
                <span style="width: 100px">Updated:</span>
                <n-date-picker
                  :value="updatedAtRange"
                  @update:value="$emit('update:updatedAtRange', $event)"
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ListAltOutlined,
  GridViewOutlined,
  AddOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@vicons/material";
import { VIEW_MODE } from "../types/ViewMode";

defineProps<{
  viewMode: VIEW_MODE;
  searchQuery: string;
  genderFilter: string | null;
  sortBy: string;
  dobRange: [number, number] | null;
  createdAtRange: [number, number] | null;
  updatedAtRange: [number, number] | null;
}>();

defineEmits<{
  add: [];
  export: [];
  "update:viewMode": [value: VIEW_MODE];
  "update:searchQuery": [value: string];
  "update:genderFilter": [value: string | null];
  "update:sortBy": [value: string];
  "update:dobRange": [value: [number, number] | null];
  "update:createdAtRange": [value: [number, number] | null];
  "update:updatedAtRange": [value: [number, number] | null];
  clearFilters: [];
}>();

const showAdvancedFilters = ref(false);

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
</script>

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
</style>
