<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :title="`${isEditMode ? 'Edit' : 'Add'} User`"
    style="width: 80%; max-width: 600px"
    @after-leave="handleAfterLeave"
  >
    <n-form :model="form" ref="formRef" label-placement="top" :rules="rules">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form.name" placeholder="Enter name" />
      </n-form-item>

      <n-form-item label="Email" path="email">
        <n-input v-model:value="form.email" placeholder="Enter email" />
      </n-form-item>

      <n-grid :cols="2" :x-gap="12">
        <n-form-item-gi label="Date of Birth" path="dob">
          <n-date-picker
            v-model:value="form.dob"
            type="date"
            placeholder="Select DOB"
            :is-date-disabled="isDateDisabled"
            style="width: 100%"
          />
        </n-form-item-gi>

        <n-form-item-gi label="Gender" path="gender">
          <n-select
            v-model:value="form.gender"
            :options="genderOptions"
            placeholder="Select gender"
          />
        </n-form-item-gi>
      </n-grid>

      <n-space justify="end">
        <n-button @click="handleCancel">Cancel</n-button>
        <n-button type="primary" @click="handleSubmit">
          {{ isEditMode ? "Save" : "Add" }}
        </n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { FormInst, FormRules } from "naive-ui";
import { useUserStore, type User } from "../stores/UserStore";
import { Timestamp } from "firebase/firestore";

const props = defineProps<{
  show: boolean;
  user?: User | null;
}>();

const emit = defineEmits<{
  "update:show": [value: boolean];
  success: [];
}>();

const userStore = useUserStore();

const formRef = ref<FormInst | null>(null);
const form = ref<{
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

const isDateDisabled = (timestamp: number) => {
  return timestamp > Date.now();
};

const rules: FormRules = {
  name: { required: true, message: "Please input name", trigger: "blur" },
  email: [
    { required: true, message: "Please input email", trigger: "blur" },
    { type: "email", message: "Invalid email", trigger: "blur" },
  ],
  dob: {
    required: true,
    message: "Select date of birth",
    trigger: ["blur", "change"],
    validator: (_, value) => {
      if (!value) return new Error("Please select date of birth");
      if (typeof value === "number" && value > 0) return true;
      return new Error("Please select a valid date");
    },
  },
  gender: { required: true, message: "Select gender", trigger: "blur" },
};

const showModal = computed({
  get: () => props.show,
  set: (value) => emit("update:show", value),
});

const isEditMode = computed(() => !!props.user);

watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = {
        name: user.name,
        email: user.email,
        dob: user.dob ? user.dob.toMillis() : null,
        gender: user.gender,
      };
    }
  },
  { immediate: true }
);

const resetForm = () => {
  form.value = {
    name: "",
    email: "",
    dob: null,
    gender: null,
  };
  formRef.value?.restoreValidation();
};

const handleCancel = () => {
  showModal.value = false;
};

const handleAfterLeave = () => {
  resetForm();
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    const dobTimestamp = form.value.dob
      ? Timestamp.fromMillis(form.value.dob)
      : null;

    if (isEditMode.value && props.user) {
      await userStore.updateUser(props.user.id, {
        name: form.value.name,
        email: form.value.email,
        dob: dobTimestamp,
        gender: form.value.gender,
      });
    } else {
      await userStore.addUser({
        name: form.value.name,
        email: form.value.email,
        dob: dobTimestamp,
        gender: form.value.gender,
      });
    }

    showModal.value = false;
    emit("success");
  } catch (error) {
    console.error("Validation failed:", error);
  }
};
</script>
