<template>
  <button
    class="rounded-4xl bg-gray-secondary py-4 px-8 text-xl font-medium hover:bg-primary transition-all flex items-center justify-center"
  >
    <span class="first-letter:uppercase">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
