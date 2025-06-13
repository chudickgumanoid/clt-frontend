<template>
  <header class="bg-gray-primary">
    <div class="container flex justify-between gap-10 py-8">
      <nuxt-link to="/">
        <img
          src="/img/logo.svg"
          alt="CLT Логотип"
        />
      </nuxt-link>

      <div class="flex items-center justify-center gap-10">
        <div class="flex items-center justify-center gap-3 text-3xl">
          <img
            src="/img/map-point.svg"
            alt="Адрес"
          />
          Адрес
        </div>
        <div class="flex items-center justify-center gap-3 text-3xl">
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

<style lang="scss" scoped></style>
