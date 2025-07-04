<script setup>
import { nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import NotificationProvider from "~/components/NotificationProvider.vue";

const router = useRouter();
const { locale, setLocale } = useI18n();

router.afterEach(() => {
  // ждём, пока NuxtPage отрендерится
  nextTick(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
});

onMounted(() => {
  if (!locale.value) {
    setLocale("ru");
  }
});
</script>

<template>
  <NotificationProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </NotificationProvider>
</template>
