<template>
  <div class="px-4 container flex flex-col gap-15">
    <div class="flex items-center justify-between">
      <div class="text-primary font-bicubik text-2xl mb-6 w-full">
        Скорость - наш конёк
      </div>

      <div class="flex justify-between items-center gap-12">
        <MInput
          v-model="search"
          placeholder="поиск"
        />
        <nuxt-link to="/cart">
          <CartButton />
        </nuxt-link>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 my-4">
      <template
        v-for="category in categoryesData"
        :key="category"
      >
        <nuxt-link :to="`/catalog/${category.id}`">
          <CategoryTag
            class="!cursor-pointer"
            :label="category.name"
          />
        </nuxt-link>
      </template>
    </div>

    <div class="flex flex-col gap-8">
      <h2 class="text-white text-lg font-bold mb-4">
        <CategoryTag label="Популярные товары" />
      </h2>
      <div class="grid grid-cols-4 gap-14 gap-y-8">
        <ProductCard
          v-for="item in dataProducts"
          :key="item.id"
          :product="item"
        />
      </div>
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
