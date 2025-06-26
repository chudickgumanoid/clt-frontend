<template>
  <footer class="bg-gray-primary">
    <div
      class="container grid grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4 max-sm:!py-8 items-start py-8"
    >
      <div class="max-sm:flex max-sm:flex-col max-sm:gap-2">
        <div
          class="flex justify-center max-sm:justify-start items-center gap-3 max-sm:gap-2 max-sm:text-[11px]"
        >
          {{ $t("Если не нашли запчасть, пишите нам на WhatsApp") }}
          <img
            src="/img/whatsapp.svg"
            alt="Whatsapp"
            class="max-sm:w-4 max-sm:h-4"
          />
        </div>
        <div class="flex items-center justify-center gap-4">
          <img
            src="/img/instagram.svg"
            alt="instagram"
            class="max-sm:w-4 max-sm:h-4"
          />
          <img
            src="/img/tiktok.svg"
            alt="tiktok"
            class="max-sm:w-4 max-sm:h-4"
          />
        </div>
      </div>

      <div
        class="flex items-center justify-center gap-3 max-sm:gap-2 max-sm:text-[11px]"
      >
        <img
          src="/img/car.svg"
          alt="Грузовик"
          class="max-sm:w-4 max-sm:h-4"
        />
        {{ $t("Доставка по городу Алматы и регионам") }}
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped></style>
