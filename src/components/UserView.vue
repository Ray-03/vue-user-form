<template>
  <n-spin :show="loading">
    <n-empty
      v-if="!filteredUsers.length && !loading"
      description="No users found"
    />

    <n-list v-else-if="viewMode === VIEW_MODE.LIST">
      <user-item
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        :view-mode="viewMode"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </n-list>

    <div v-else class="grid-container">
      <user-item
        v-for="user in filteredUsers"
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
import { computed, watch, onMounted } from "vue";
import { useUserStore, type User } from "../stores/UserStore";
import UserItem from "./UserItem.vue";
import { VIEW_MODE } from "../types/ViewMode";

const props = defineProps<{
  viewMode: VIEW_MODE;
  searchQuery?: string;
  genderFilter?: string | null;
  sortBy?: string;
  dobRange?: [number, number] | null;
  createdAtRange?: [number, number] | null;
  updatedAtRange?: [number, number] | null;
}>();

const emit = defineEmits<{
  edit: [user: User];
}>();

const userStore = useUserStore();
const loading = computed(() => userStore.loading);

const filteredUsers = computed(() => userStore.users);

watch(
  () => [
    props.searchQuery,
    props.genderFilter,
    props.sortBy,
    props.dobRange,
    props.createdAtRange,
    props.updatedAtRange,
  ],
  () => {
    const sortField = props.sortBy ? props.sortBy.split("-")[0] : "createdAt";
    const sortOrder = props.sortBy
      ? (props.sortBy.split("-")[1] as "asc" | "desc")
      : "desc";

    userStore.fetchUsers({
      sortField,
      sortOrder,
      genderFilter: props.genderFilter || null,
      namePrefix: props.searchQuery || null,
      emailPrefix: null,
      dobStart: props.dobRange?.[0] || null,
      dobEnd: props.dobRange?.[1] || null,
      createdAtStart: props.createdAtRange?.[0] || null,
      createdAtEnd: props.createdAtRange?.[1] || null,
      updatedAtStart: props.updatedAtRange?.[0] || null,
      updatedAtEnd: props.updatedAtRange?.[1] || null,
    });
  },
  { immediate: false }
);

onMounted(() => {
  const sortField = props.sortBy ? props.sortBy.split("-")[0] : "createdAt";
  const sortOrder = props.sortBy
    ? (props.sortBy.split("-")[1] as "asc" | "desc")
    : "desc";

  userStore.fetchUsers({
    sortField,
    sortOrder,
    genderFilter: props.genderFilter || null,
    namePrefix: props.searchQuery || null,
    emailPrefix: null,
    dobStart: props.dobRange?.[0] || null,
    dobEnd: props.dobRange?.[1] || null,
    createdAtStart: props.createdAtRange?.[0] || null,
    createdAtEnd: props.createdAtRange?.[1] || null,
    updatedAtStart: props.updatedAtRange?.[0] || null,
    updatedAtEnd: props.updatedAtRange?.[1] || null,
  });
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
