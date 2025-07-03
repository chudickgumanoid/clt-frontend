<template>
  <header class="bg-gray-primary">
    <div
      class="container max-sm:items-center flex justify-between gap-10 py-8 max-sm:!py-6"
    >
      <nuxt-link
        to="/admin/login"
        class="max-sm:max-w-[120px]"
      >
        <img
          src="/img/logo.svg"
          alt="CLT Логотип"
        />
      </nuxt-link>

      <div class="flex items-center justify-center gap-10 max-sm:gap-4">
        <LangSwitcher />
        <div
          class="flex items-center justify-center gap-3 max-sm:gap-2 text-3xl max-sm:text-[10px]"
        >
          <img
            src="/img/map-point.svg"
            alt="Адрес"
            class="max-sm:h-4 max-sm:w-4"
          />
          Алматы
        </div>
        <div
          class="flex items-center justify-center gap-3 max-sm:gap-2 text-3xl max-sm:text-[10px]"
        >
          <img
            src="/img/phone.svg"
            alt="Телефон"
            class="max-sm:h-4 max-sm:w-4"
          />
          <a href="https://wa.me/77085707063"> +7 708 570 7063 </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import LangSwitcher from "../lang/LangSwitcher.vue";

const { t } = useI18n();
</script>

<style scoped></style>
