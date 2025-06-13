<template>
  <section class="container relative">
    <div class="flex flex-col gap-14">
      <div class="flex justify-between items-center gap-12">
        <nuxt-link
          to="/"
          class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all"
        >
          Назад
        </nuxt-link>

        <nuxt-link to="/cart">
          <CartButton />
        </nuxt-link>
      </div>

      <div
        v-if="product"
        class="grid grid-cols-[2fr_1fr] gap-10 bg-[#4B4B4B] rounded-3xl p-8 text-white"
      >
        <!-- ЛЕВАЯ СТОРОНА -->
        <div class="flex flex-col gap-6">
          <ApiImg
            :image-id="activeImage"
            class="rounded-xl object-contain w-full max-h-[400px]"
            alt="Product image"
          />

          <div class="flex gap-2">
            <img
              v-for="img in product.images"
              :key="img"
              :src="`${config.public.apiBaseUrl}/image?imageId=${img}`"
              class="w-20 h-20 rounded-xl object-cover border-2 border-transparent hover:border-white cursor-pointer"
              :class="{ 'border-white': img === activeImage }"
              @click="activeImage = img"
            />
          </div>
        </div>

        <!-- ПРАВАЯ СТОРОНА -->
        <div class="flex flex-col justify-between gap-6">
          <div class="flex flex-col gap-2">
            <div class="text-2xl font-semibold">{{ product.name }}</div>
            <div class="text-sm text-gray-300">{{ product.description }}</div>
            <div class="text-xl mt-2">{{ tengeFormat(product.price) }}</div>
          </div>

          <button
            title="Добавить в корзину"
            class="cursor-pointer flex items-end justify-end gap-2 px-6 py-3 text-black font-semibold transition-all text-lg"
            @click.stop="addToCart"
          >
            <img
              src="/img/cart.svg"
              class="h-10 max-h-10"
              alt="В корзину"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";
import ApiImg from "~/components/UI/ApiImg.vue";
import { tengeFormat } from "~/shared/utils/currencyFormat";

useHead({ title: "Страница товара" });

const route = useRoute();
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();

const productList = await $axios.get("/products", {
  params: { productId: route.params.product_id },
});

// Берём первый элемент
const product = ref(productList.data?.[0] || null);
const activeImage = ref(product.value?.images?.[0] || "");

const cart = useLocalStorage("cart", []);
const addToCart = () => {
  if (!product.value) return;

  const existing = cart.value.find((item) => item.id === product.value.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({
      ...product.value,
      quantity: 1,
      image: `${config.public.apiBaseUrl}/image?imageId=${product.value.image}`,
    });
  }
};
</script>
