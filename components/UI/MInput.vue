<template>
  <input
    v-model="model"
    v-bind="$attrs"
    :class="computedClass"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "default",
  },
});

const model = defineModel("value");

const computedClass = computed(() => {
  const base =
    "rounded-full px-6 py-2 text-2xl outline-none w-full max-w-md placeholder:text-[#9E9E9E]";

  const variants = {
    default: "bg-gray-secondary text-white",
    big: "text-2xl py-4 rounded-full px-6 bg-[#7B7B7B] outline-none w-full max-w-md placeholder:text-[#9E9E9E]",
    error: "text-2xl py-4 rounded-full px-6 bg-red-200 outline-none w-full max-w-md placeholder:text-[#9E9E9E]",
    success: "bg-green-500 text-white",
  };

  return `${base} ${variants[props.variant] || variants.default}`;
});
</script>
