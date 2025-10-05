<template>
  <component
    :is="viewMode === VIEW_MODE.LIST ? 'n-list-item' : 'div'"
    :class="{ 'user-item': true, 'grid-mode': viewMode === VIEW_MODE.GRID }"
  >
    <n-card :hoverable="true" class="clickable-card" @click="handleCardClick">
      <div class="card-layout">
        <div class="card-header">
          <h3 class="user-name">{{ user.name }}</h3>
          <n-tag :type="genderInfo.type" size="small">
            {{ genderInfo.symbol }}
          </n-tag>
        </div>

        <div class="card-body">
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

        <div class="card-footer">
          <n-button
            size="small"
            type="error"
            tertiary
            @click.stop="emit('delete', user.id)"
          >
            <template #icon>
              <n-icon>
                <DeleteOutlined />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </n-card>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { User } from "../stores/UserStore";
import type { Timestamp } from "firebase/firestore";
import {
  EmailOutlined,
  CalendarMonthOutlined,
  DeleteOutlined,
} from "@vicons/material";
import { VIEW_MODE } from "../types/ViewMode";

const props = defineProps<{
  user: User;
  viewMode?: VIEW_MODE;
}>();

const emit = defineEmits<{
  delete: [id: string];
  edit: [user: User];
}>();

const formatDate = (date: Timestamp | null) => {
  if (!date) return "";
  try {
    return date.toDate().toLocaleDateString();
  } catch {
    return "";
  }
};

const genderInfo = computed(() => {
  const gender = props.user.gender;
  if (!gender) return { symbol: "?", type: "default" as const };
  const lowerGender = gender.toLowerCase();
  if (lowerGender === "male") return { symbol: "♂", type: "info" as const };
  if (lowerGender === "female") return { symbol: "♀", type: "error" as const };
  return { symbol: "⚧", type: "success" as const };
});

const handleCardClick = () => {
  emit("edit", props.user);
};
</script>

<style scoped>
.user-item {
  width: 100%;
  height: 100%;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
}

.clickable-card:hover {
  transform: translateY(-2px);
}

.card-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  margin-bottom: 16px;
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

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}
</style>
