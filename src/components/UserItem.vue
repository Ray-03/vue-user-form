<template>
  <n-list-item>
    <n-card>
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>DOB:</strong> {{ formatDate(user.dob) }}</p>
      <p><strong>Gender:</strong> {{ user.gender }}</p>
      <p><strong>Created At:</strong> {{ formatDate(user.createdAt) }}</p>
      <p><strong>Updated At:</strong> {{ formatDate(user.updatedAt) }}</p>

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
  </n-list-item>
</template>

<script setup lang="ts">
import type { User } from "../stores/UserStore";
defineProps<{ user: User }>();

const formatDate = (date?: Date) =>
  date ? new Date(date).toLocaleDateString() : "";
</script>
