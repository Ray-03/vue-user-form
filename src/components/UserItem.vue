<template>
  <component
    :is="viewMode === VIEW_MODE.LIST ? 'n-list-item' : 'div'"
    :class="{ 'user-item': true, 'grid-mode': viewMode === VIEW_MODE.GRID }"
  >
    <n-card :hoverable="viewMode === VIEW_MODE.GRID">
      <div class="user-header">
        <h3 class="user-name">{{ user.name }}</h3>
        <n-tag :type="getGenderTagType(user.gender)" size="small">
          {{ user.gender }}
        </n-tag>
      </div>

      <n-divider
        :style="{ margin: viewMode === VIEW_MODE.GRID ? '12px 0' : '8px 0' }"
      />

      <div class="user-content">
        <div class="info-row">
          <n-icon>
            <EmailOutlined />
          </n-icon>
          <n-text>{{ user.email }}</n-text>
        </div>
        <div class="info-row">
          <n-icon>
            <CalendarMonthOutlined />
          </n-icon>
          <n-text>DOB: {{ formatDate(user.dob) }}</n-text>
        </div>
        <div class="info-row">
          <n-text depth="3" class="timestamp">
            Created: {{ formatDate(user.createdAt) }} | Updated:
            {{ formatDate(user.updatedAt) }}
          </n-text>
        </div>
      </div>

      <n-divider
        :style="{ margin: viewMode === 'grid' ? '12px 0' : '8px 0' }"
      />

      <n-space justify="end">
        <n-button
          size="small"
          type="error"
          tertiary
          @click="$emit('delete', user.id)"
        >
          Delete
        </n-button>
      </n-space>
    </n-card>
  </component>
</template>

<script setup lang="ts">
import type { User } from "../stores/UserStore";
import type { Timestamp } from "firebase/firestore";
import { EmailOutlined, CalendarMonthOutlined } from "@vicons/material";
import { VIEW_MODE } from "../types/ViewMode";

defineProps<{
  user: User;
  viewMode?: VIEW_MODE;
}>();

const formatDate = (date: Timestamp | null) => {
  if (!date) return "";
  try {
    return date.toDate().toLocaleDateString();
  } catch {
    return "";
  }
};

const getGenderTagType = (gender: string | null) => {
  if (!gender) return "default";
  const lowerGender = gender.toLowerCase();
  if (lowerGender === "male") return "error"; // red
  if (lowerGender === "female") return "info"; // blue
  return "success"; // green for other
};
</script>

<style scoped>
.user-item {
  width: 100%;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.user-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.timestamp {
  font-size: 12px;
}

.grid-mode .user-content {
  gap: 8px;
}
</style>
