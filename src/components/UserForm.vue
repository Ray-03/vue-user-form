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
        <n-button type="primary" @click="addUser">Add</n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInst, FormRules } from "naive-ui";

const formRef = ref<FormInst | null>(null);

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
  dob: {
    required: true,
    message: "Select date of birth",
    trigger: "blur",
    validator: (_, value) => {
      if (!value) return false;
      if (value instanceof Date) return !isNaN(value.getTime());
      if (typeof value === "number") return value > 0;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    },
  },
  gender: { required: true, message: "Select gender", trigger: "blur" },
};

interface User {
  id: string;
  name: string;
  email: string;
  dob: Date;
  gender: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const users = ref<User[]>([
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    dob: new Date("1990-05-15"),
    gender: "Male",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dob: new Date("1988-12-03"),
    gender: "Female",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    dob: new Date("1995-08-22"),
    gender: "Other",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    dob: new Date("1992-03-10"),
    gender: "Female",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    name: "Mike Brown",
    email: "mike.brown@example.com",
    dob: new Date("1987-11-28"),
    gender: "Male",
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
]);

const addUser = async () => {
  await formRef.value?.validate();
  console.log(form.value);
};
</script>
