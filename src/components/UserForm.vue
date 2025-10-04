<template>
  <n-card title="Add User">
    <n-form :model="form" ref="formRef" label-placement="top">
      <n-form-item label="Name" path="name">
        <n-input placeholder="Enter name" />
      </n-form-item>

      <n-form-item label="Email" path="email">
        <n-input placeholder="Enter email" />
      </n-form-item>

      <n-form-item label="Date of Birth" path="dob">
        <n-date-picker type="date" placeholder="Select DOB" />
      </n-form-item>

      <n-form-item label="Gender" path="gender">
        <n-select placeholder="Select gender" :options="genderOptions" />
      </n-form-item>

      <n-space justify="end">
        <n-button type="primary">Add</n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  dob: "",
  gender: "",
});

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
</script>
