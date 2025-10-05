<template>
  <n-card title="User List">
    <template #header-extra>
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
    </template>

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
  </n-card>

  <n-modal
    v-model:show="showEditModal"
    preset="card"
    title="Edit User"
    style="width: 80%"
  >
    <n-form
      :model="editForm"
      ref="formRef"
      label-placement="top"
      :rules="rules"
    >
      <n-form-item label="Name" path="name">
        <n-input v-model:value="editForm.name" placeholder="Enter name" />
      </n-form-item>

      <n-form-item label="Email" path="email">
        <n-input v-model:value="editForm.email" placeholder="Enter email" />
      </n-form-item>

      <n-grid :cols="2" :x-gap="12">
        <n-form-item-gi label="Date of Birth" path="dob">
          <n-date-picker
            v-model:value="editForm.dob"
            type="date"
            placeholder="Select DOB"
            style="width: 100%"
          />
        </n-form-item-gi>

        <n-form-item-gi label="Gender" path="gender">
          <n-select
            v-model:value="editForm.gender"
            :options="genderOptions"
            placeholder="Select gender"
          />
        </n-form-item-gi>
      </n-grid>

      <n-space justify="end">
        <n-button @click="showEditModal = false">Cancel</n-button>
        <n-button type="primary" @click="saveEdit">Save</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore, type User } from "../stores/UserStore";
import UserItem from "./UserItem.vue";
import { ListAltOutlined, GridViewOutlined } from "@vicons/material";
import { VIEW_MODE } from "../types/ViewMode";
import type { FormInst, FormRules } from "naive-ui";
import { Timestamp } from "firebase/firestore";

const userStore = useUserStore();
const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);
const viewMode = ref<VIEW_MODE>(VIEW_MODE.LIST);

const showEditModal = ref(false);
const formRef = ref<FormInst | null>(null);
const editingUserId = ref<string | null>(null);
const editForm = ref<{
  name: string;
  email: string;
  dob: number | null;
  gender: string | null;
}>({
  name: "",
  email: "",
  dob: null,
  gender: null,
});

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const rules: FormRules = {
  name: { required: true, message: "Please input name", trigger: "blur" },
  email: [
    { required: true, message: "Please input email", trigger: "blur" },
    { type: "email", message: "Invalid email", trigger: "blur" },
  ],
  dob: {
    required: true,
    message: "Select date of birth",
    trigger: "blur",
  },
  gender: { required: true, message: "Select gender", trigger: "blur" },
};

onMounted(() => {
  userStore.fetchUsers();
});

const handleDelete = (id: string) => userStore.deleteUser(id);

const handleEdit = (user: User) => {
  editingUserId.value = user.id;
  editForm.value = {
    name: user.name,
    email: user.email,
    dob: user.dob ? user.dob.toMillis() : null,
    gender: user.gender,
  };
  showEditModal.value = true;
};

const saveEdit = async () => {
  try {
    await formRef.value?.validate();

    if (!editingUserId.value) return;

    const dobTimestamp = editForm.value.dob
      ? Timestamp.fromMillis(editForm.value.dob)
      : null;

    await userStore.updateUser(editingUserId.value, {
      name: editForm.value.name,
      email: editForm.value.email,
      dob: dobTimestamp,
      gender: editForm.value.gender,
    });

    showEditModal.value = false;
    editingUserId.value = null;
  } catch (error) {
    console.error("Validation failed:", error);
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
</style>
