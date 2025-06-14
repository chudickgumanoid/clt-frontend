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
        <div
          class="flex items-center justify-center gap-3 text-3xl max-sm:text-sm"
        >
          <img
            src="/img/map-point.svg"
            alt="Адрес"
          />
          Адрес
        </div>
        <div
          class="flex items-center justify-center gap-3 text-3xl max-sm:text-sm"
        >
          <img
            src="/img/phone.svg"
            alt="Телефон"
          />
          Телефон
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>

<style scoped></style>
