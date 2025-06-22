<template>
  <footer class="bg-gray-primary">
    <div
      class="container grid grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4 max-sm:!py-8 items-start py-8"
    >
      <div>
        <div class="flex justify-center items-center gap-3">
          {{ $t("Если не нашли запчасть, пишите нам на WhatsApp") }}
          <img
            src="/img/whatsapp.svg"
            alt="Whatsapp"
          />
        </div>
        <div class="flex items-center justify-center gap-4">
          <img
            src="/img/instagram.svg"
            alt="instagram"
          />
          <img
            src="/img/tiktok.svg"
            alt="tiktok"
          />
        </div>
      </div>

      <div class="flex items-center justify-center gap-3">
        <img
          src="/img/car.svg"
          alt="Грузовик"
        />
        {{ $t("Доставка по городу Алматы и регионам") }}
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped></style>
