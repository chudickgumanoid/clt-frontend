<template>
  <section class="container relative">
    <div class="flex flex-col gap-14">
      <div class="flex justify-between items-center gap-12">
        <nuxt-link
          :to="$localePath('/')"
          class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all"
        >
          {{ $t("Назад") }}
        </nuxt-link>

        <nuxt-link :to="$localePath('/cart')">
          <CartButton />
        </nuxt-link>
      </div>

      <div
        v-if="product"
        class="grid grid-cols-[2fr_1fr] gap-10 bg-[#4B4B4B] rounded-3xl p-8 text-white"
      >
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
              :src="`${BASE_API_URL}/image?imageId=${img}`"
              class="w-20 h-20 rounded-xl object-cover border-2 border-transparent hover:border-white cursor-pointer"
              :class="{ 'border-white': img === activeImage }"
              @click="activeImage = img"
            />
          </div>
        </div>

        <div class="flex flex-col justify-between gap-6">
          <div class="flex flex-col gap-2">
            <div class="text-2xl font-semibold">{{ product.name }}</div>
            <div class="text-sm text-gray-300">{{ product.description }}</div>
            <div class="text-xl mt-2">{{ tengeFormat(product.price) }}</div>
          </div>

          <button
            :title="t('Добавить в корзину')"
            class="cursor-pointer flex items-end justify-end gap-2 px-6 py-3 text-black font-semibold transition-all text-lg"
            @click.stop="addToCart"
          >
            <img
              src="/img/cart.svg"
              class="h-10 max-h-10"
              :alt="t('В корзину')"
            />
          </button>
        </div>
      </div>

      <div
        v-if="relatedProducts.length"
        class="mt-10"
      >
        <h2 class="text-2xl text-white mb-4">{{ $t("Похожие товары") }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="item in relatedProducts"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";
import ProductCard from "~/components/products/ProductCard.vue";
import ApiImg from "~/components/UI/ApiImg.vue";
import { tengeFormat } from "~/shared/utils/currencyFormat";
import { BASE_API_URL } from "~/shared/utils/constants";
import { useProducts } from "~/shared/utils/useProducts";

const { t } = useI18n();

const route = useRoute();
const { $axios } = useNuxtApp();
const config = useRuntimeConfig();

const product = ref(null);
const relatedProducts = ref([]);
const activeImage = ref("");

const { data } = await $axios.get("/products", {
  params: { productId: route.params.product_id },
});

const { dataProducts } = useProducts(data);

const mainProduct = dataProducts.value?.[0];
product.value = mainProduct;
activeImage.value = mainProduct?.images?.[0] || "";

useHead({
  title: t('productTitle', { name: product.value?.name || '' })
});
if (mainProduct?.category) {
  const related = await $axios.get("/products", {
    params: { category: mainProduct.category },
  });

  relatedProducts.value = related.data.filter((p) => p.id !== mainProduct.id);
}

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
      image: `${BASE_API_URL}/image?imageId=${product.value.images[0]}`,
    });
  }
};
</script>
