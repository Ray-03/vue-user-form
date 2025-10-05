<template>
  <n-card title="User List">
    <n-spin :show="loading">
      <n-empty v-if="!users.length && !loading" description="No users yet" />

      <n-list v-else>
        <user-item
          v-for="user in users"
          :key="user.id"
          :user="user"
          @delete="handleDelete"
        />
      </n-list>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "../stores/UserStore";
import UserItem from "./UserItem.vue";

const userStore = useUserStore();
const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);

onMounted(() => {
  userStore.fetchUsers();
});

const handleDelete = (id: string) => userStore.deleteUser(id);
</script>
