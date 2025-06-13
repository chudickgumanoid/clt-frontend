<template>
  <component
    :is="as"
    v-bind="componentAttrs"
    :class="['m-button', variantClass]"
  >
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  as: {
    type: String,
    default: "button", // 'a', 'button', 'nuxt-link', и т.д.
  },
  variant: {
    type: String,
    default: "primary", // 'primary' | 'secondary' | 'outline'
  },
  type: {
    type: String,
    default: "button",
  },
  target: String,
});

const componentAttrs = computed(() => {
  if (props.as === "a") {
    return { href: props.href, target: props.target };
  } else if (props.as === "nuxt-link") {
    return { to: props.to };
  } else {
    return { type: props.type };
  }
});

const variantClass = computed(() => {
  switch (props.variant) {
    default:
      return "cursor-pointer text-primary bg-[#1C1C1C] px-4 py-2 rounded-lg font-bold flex text-xl items-center gap-2 hover:bg-primary hover:text-white transition-all";
  }
});
</script>

<style scoped>
.m-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
</style>
