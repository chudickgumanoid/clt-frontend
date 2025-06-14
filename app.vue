<template>
  <NotificationProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NotificationProvider>
</template>

<script setup>
import NotificationProvider from '~/components/NotificationProvider.vue';
</script>
