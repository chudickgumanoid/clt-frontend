<template>
  <button
    class="rounded-4xl bg-gray-secondary py-4 px-8 text-xl font-medium hover:text-primary transition-all flex items-center justify-center max-sm:text-[11px] w-[180px] max-sm:!w-[100px] leading-4 h-full tag max-sm:max-h-[35px]"
  >
    <span class="first-letter:uppercase">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: String,
});
</script>

<style scoped>
.tag:hover {
  box-shadow: 0px 4px 4px 4px #00000040 inset;
}
</style>
