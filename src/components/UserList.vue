<template>
  <n-card title="User List">
    <n-empty v-if="!users.length" description="No users yet" />

    <n-list v-else>
      <user-item
        v-for="user in users"
        :key="user.id"
        :user="user"
        @delete="handleDelete"
      />
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "../stores/UserStore";
import UserItem from "./UserItem.vue";

const userStore = useUserStore();
const users = computed(() => userStore.users);

const handleDelete = (id: string) => userStore.deleteUser(id);
</script>
