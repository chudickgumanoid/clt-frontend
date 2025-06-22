<template>
  <NotificationProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NotificationProvider>
</template>

<script setup>
import NotificationProvider from "~/components/NotificationProvider.vue";

const { locale, setLocale } = useI18n();

onMounted(() => {
  if (!locale.value) {
    setLocale("ru");
  }
});
</script>
