<template>
  <n-card title="User List">
    <n-empty v-if="!users.length" description="No users yet" />

    <n-list v-else>
      <user-item v-for="user in users" :key="user.id" :user="user" />
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
const users: any[] = [];
</script>
