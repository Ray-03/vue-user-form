<template>
  <div style="padding: 24px">
    <h1>User Management System</h1>
    <n-divider />
    <user-form />
    <n-divider />
    <user-list />
  </div>
</template>

<script setup lang="ts">
import UserForm from "./components/UserForm.vue";
import UserList from "./components/UserViewt.vue";
</script>
