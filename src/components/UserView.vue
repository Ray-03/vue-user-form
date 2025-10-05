<template>
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
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore, type User } from "../stores/UserStore";
import UserItem from "./UserItem.vue";
import { VIEW_MODE } from "../types/ViewMode";

defineProps<{
  viewMode: VIEW_MODE;
}>();

const emit = defineEmits<{
  edit: [user: User];
}>();

const userStore = useUserStore();
const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);

onMounted(() => {
  userStore.fetchUsers();
});

const handleDelete = (id: string) => userStore.deleteUser(id);

const handleEdit = (user: User) => {
  emit("edit", user);
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
</style>
