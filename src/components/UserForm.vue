<template>
  <n-card title="Add User">
    <n-form :model="form" ref="formRef" label-placement="top" :rules="rules">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form.name" placeholder="Enter name" />
      </n-form-item>

      <n-form-item label="Email" path="email">
        <n-input v-model:value="form.email" placeholder="Enter email" />
      </n-form-item>

      <n-form-item label="Date of Birth" path="dob">
        <n-date-picker
          v-model:value="form.dob"
          type="date"
          placeholder="Select DOB"
        />
      </n-form-item>

      <n-form-item label="Gender" path="gender">
        <n-select
          v-model:value="form.gender"
          :options="genderOptions"
          placeholder="Select gender"
        />
      </n-form-item>

      <n-space justify="end">
        <n-button type="primary">Add</n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormRules } from "naive-ui";

const form = ref({
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
  dob: { required: true, message: "Select date of birth", trigger: "blur" },
  gender: { required: true, message: "Select gender", trigger: "blur" },
};
</script>
