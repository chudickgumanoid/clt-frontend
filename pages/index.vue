<template>
  <div>
    <div class="px-4 container flex flex-col gap-15 max-sm:gap-4 relative">
      <div class="flex items-center justify-between">
        <div
          class="text-primary font-bicubik text-2xl mb-6 w-full max-sm:text-[10px] max-sm:mb-0"
        >
          {{ t("Скорость - наш конёк") }}
        </div>

        <div class="flex justify-between items-center gap-12">
          <MInput
            v-model="search"
            :placeholder="t('поиск')"
            class="max-sm:max-h-[28px] max-sm:text-[15px] max-sm:pl-2"
          />
          <nuxt-link
            :to="$localePath('/cart')"
            class="max-sm:hidden"
          >
            <CartButton />
          </nuxt-link>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 my-4 max-sm:grid max-sm:grid-cols-3">
        <template
          v-for="category in categoryesData"
          :key="category"
        >
          <nuxt-link :to="$localePath(`/catalog?category=${category.id}`)">
            <CategoryTag
              class="!cursor-pointer"
              :label="t(category.i18nKey)"
            />
          </nuxt-link>
        </template>
      </div>

      <div class="flex flex-col gap-8 max-sm:gap-4">
        <h2 class="text-white text-lg font-bold mb-4 max-sm:mb-2 max-sm:!px-2">
          <CategoryTag
            label="Популярные товары"
            class="max-sm:!w-fit max-sm:!text-[15px]"
          />
        </h2>
        <div class="grid grid-cols-4 max-sm:grid-cols-1 gap-14 gap-y-8">
          <ProductCard
            v-for="item in dataProducts"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>
    </div>

    <div
      class="hidden max-sm:block w-full sticky bottom-0 mt-4 right-0 bg-gray-secondary"
    >
      <div
        class="flex items-center justify-center bg-white w-fit mx-auto rounded-full p-2 relative bottom-2"
      >
        <nuxt-link
          to="/cart"
          class=""
        >
          <CartButton class="max-w-[45px] max-h-[45px] w-[45px] h-[45px]" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDebounceFn } from "@vueuse/core";
import ProductCard from "~/components/products/ProductCard.vue";
import MInput from "~/components/UI/MInput.vue";
import { useProducts } from "~/shared/utils/useProducts";

const { t } = useI18n();

useHead({
  title: "CLT - Магазин запчастей",
});

const { $axios } = useNuxtApp();

const search = ref("");
const dataProducts = ref([]);
const categoryesData = ref([]);

const fetchProducts = async (searchText = "") => {
  try {
    const { data } = await $axios.get("/products", {
      params: { searchText: searchText ? searchText : undefined },
    });
    const { dataProducts: processedProducts } = useProducts(data);
    dataProducts.value = processedProducts.value;
  } catch (error) {
    console.error("Error fetching products:", error);
    dataProducts.value = [];
  }
};

function normalizeKey(russianString) {
  return russianString
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, "_")
    .replace(/[^a-zа-я0-9_]/gi, "");
}

const fetchCategories = async () => {
  try {
    const { data } = await $axios.get("/categoryes");

    categoryesData.value = data.map((item) => ({
      ...item,
      i18nKey: normalizeKey(item.name),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const debouncedFetchProducts = useDebounceFn((searchText) => {
  fetchProducts(searchText);
}, 300);

watch(search, (newValue) => {
  debouncedFetchProducts(newValue);
});

await Promise.all([fetchProducts(""), fetchCategories()]);
</script>

<style scoped></style>
