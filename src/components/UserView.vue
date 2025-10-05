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
        @delete="handleDeleteClick"
        @edit="handleEdit"
      />
    </n-list>

    <div v-else class="grid-container">
      <user-item
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
        :view-mode="viewMode"
        @delete="handleDeleteClick"
        @edit="handleEdit"
      />
    </div>
  </n-spin>

  <n-modal
    v-model:show="showDeleteModal"
    preset="dialog"
    title="Confirm Delete"
    content="Are you sure you want to delete this user? This action cannot be undone."
    positive-text="Delete"
    negative-text="Cancel"
    @positive-click="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
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

const showDeleteModal = ref(false);
const userToDelete = ref<string | null>(null);

const handleDeleteClick = (id: string) => {
  userToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (userToDelete.value) {
    userStore.deleteUser(userToDelete.value);
    userToDelete.value = null;
  }
  showDeleteModal.value = false;
};

const handleEdit = (user: User) => {
  emit("edit", user);
};

const getFilteredUsers = () => {
  return filteredUsers.value;
};

defineExpose({
  getFilteredUsers,
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
</style>
