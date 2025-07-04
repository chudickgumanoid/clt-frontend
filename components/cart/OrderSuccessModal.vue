<template>
  <teleport to="body">
    <div
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40"
      @click.self="$emit('close')"
    >
      <div
        class="bg-[#2C2C2C]/95 text-white relative rounded-3xl px-10 py-8 max-w-[480px] text-center flex flex-col items-center gap-6"
      >
        <nuxt-link
          :to="$localePath(`/`)"
          class="absolute top-4 right-4 text-white text-3xl"
          @click="$emit('close')"
        >
          &times;
        </nuxt-link>

        <p class="text-xl">
          {{
            $t("Ваш заказ создан, менеджер свяжется с Вами в ближайшее время")
          }}
        </p>
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 13l4 4L19 7"
            stroke="#F5C842"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const { t } = useI18n();
</script>
