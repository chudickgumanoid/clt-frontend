<template>
  <header class="bg-gray-primary">
    <div
      class="container max-sm:items-center flex justify-between gap-10 py-8 max-sm:!py-6"
    >
      <nuxt-link
        to="/"
        class="max-sm:max-w-[120px]"
      >
        <img
          src="/img/logo.svg"
          alt="CLT Логотип"
        />
      </nuxt-link>

      <div class="flex items-center justify-center gap-10">
        <LangSwitcher />
        <div
          class="flex items-center justify-center gap-3 text-3xl max-sm:text-sm"
        >
          <img
            src="/img/map-point.svg"
            alt="Адрес"
          />
          {{ $t('Адрес') }}
        </div>
        <div
          class="flex items-center justify-center gap-3 text-3xl max-sm:text-sm"
        >
          <img
            src="/img/phone.svg"
            alt="Телефон"
          />
          {{ $t('Телефон') }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import LangSwitcher from '../lang/LangSwitcher.vue';

const { t } = useI18n();
</script>

<style scoped></style>
