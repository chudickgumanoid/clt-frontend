<template>
  <div class="px-4 container flex flex-col gap-15 max-sm:gap-4 relative">
    <div class="flex items-center justify-between">
      <div
        class="text-primary font-bicubik text-2xl mb-6 w-full max-sm:text-sm max-sm:mb-0"
      >
        Скорость - наш конёк
      </div>

      <div class="flex justify-between items-center gap-12">
        <MInput
          v-model="search"
          placeholder="поиск"
        />
        <nuxt-link
          to="/cart"
          class="max-sm:hidden"
        >
          <CartButton />
        </nuxt-link>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 my-4">
      <template
        v-for="category in categoryesData"
        :key="category"
      >
        <nuxt-link :to="`/catalog`">
          <CategoryTag
            class="!cursor-pointer"
            :label="category.name"
          />
        </nuxt-link>
      </template>
    </div>

    <div class="flex flex-col gap-8 max-sm:gap-4">
      <h2 class="text-white text-lg font-bold mb-4 max-sm:mb-2">
        <CategoryTag label="Популярные товары" />
      </h2>
      <div class="grid grid-cols-4 max-sm:grid-cols-1 gap-14 gap-y-8">
        <ProductCard
          v-for="item in dataProducts"
          :key="item.id"
          :product="item"
        />
      </div>
    </div>

    <div
      class="hidden max-sm:block fixed bottom-4 right-4 w-fit bg-gray-secondary p-4 rounded-2xl"
    >
      <nuxt-link
        to="/cart"
        class=""
      >
        <CartButton />
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "~/components/products/ProductCard.vue";
import MInput from "~/components/UI/MInput.vue";
import { useProducts } from "~/shared/utils/useProducts";

useHead({
  title: "CLT - Магазин запчастей",
});

const { $axios } = useNuxtApp();

const { data: productsRaw } = await $axios.get("/products");

const { dataProducts } = useProducts(productsRaw);
const { data: categoryesData } = await $axios.get("/categoryes");

const search = ref("");
</script>

<style scoped></style>
