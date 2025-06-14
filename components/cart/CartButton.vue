<template>
  <div class="relative w-fit">
    <img
      src="/img/cart.svg"
      alt="Корзина"
    />

    <span
      v-if="cart.length > 0"
      class="absolute -bottom-2 text-black text-2xl -right-4 bg-[#D9D9D9] rounded-full w-7 h-7 flex items-center justify-center p-1"
    >
      {{ cart.length }}
    </span>
  </div>
</template>

<script setup>
const cart = useLocalStorage("cart", []);
</script>

<style scoped></style>
