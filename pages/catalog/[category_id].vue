<template>
  <div class="container">
    <div class="flex flex-col gap-15 max-sm:gap-8">
      <!-- Наверху: Назад + фильтры + корзина -->
      <div class="sticky top-0 z-10 py-4 max-sm:static">
        <div class="flex justify-between items-center max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
          <nuxt-link
            to="/"
            class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all max-sm:text-base max-sm:px-4 max-sm:py-2"
          >
            Назад
          </nuxt-link>

          <div class="flex gap-6 max-sm:flex-col max-sm:gap-2">
            <FilterBar
              v-model="selectedFilters"
              :filters="filters"
            />

            <nuxt-link to="/cart" class="self-end max-sm:self-start">
              <LazyCartButton />
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Основная часть: фильтры + товары -->
      <div class="grid grid-cols-[auto_2fr] gap-10 max-sm:grid-cols-1 max-sm:gap-6">
        <!-- Сайдбар -->
        <div
          class="sticky top-[100px] self-start h-fit flex flex-col gap-2 max-h-[383px] overflow-auto pr-20 max-sm:static max-sm:overflow-visible max-sm:pr-0"
        >
          <template v-if="subcategoryes.length">
            <template
              v-for="subcategory in subcategoryes"
              :key="subcategory.id"
            >
              <nuxt-link
                :to="`/catalog/${route.params.category_id}?subcategory=${subcategory.id}`"
              >
                <CategoryTag :label="subcategory.name" />
              </nuxt-link>
            </template>
          </template>
          <div v-else>Список пуст</div>
        </div>

        <!-- Товары -->
        <div class="grid grid-cols-3 gap-14 gap-y-8 max-sm:grid-cols-1">
          <template v-if="dataProducts.length">
            <ProductCard
              v-for="item in dataProducts"
              :key="item.id"
              :product="item"
            />
          </template>
          <div v-else>Список пуст</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import FilterBar from "~/components/category/FilterBar.vue";
import ProductCard from "~/components/products/ProductCard.vue";
import { useProducts } from "~/shared/utils/useProducts";

useHead({ title: "Каталог" });

const route = useRoute();
const { $axios } = useNuxtApp();

const selectedFilters = ref({});
const dataProducts = ref([]);
const filters = ref([]);
const subcategoryes = ref([]);

const buildQueryParams = () => {
  const base = {
    categoryId: route.params.category_id,
    subcategoryId: route.query.subcategory,
  };

  const filterParams = {};
  for (const [key, value] of Object.entries(selectedFilters.value)) {
    if (Array.isArray(value)) {
      filterParams[key] = value.join(",");
    } else {
      filterParams[key] = value;
    }
  }

  return { ...base, ...filterParams };
};

const fetchProducts = async () => {
  const { data } = await $axios.get("/products", {
    params: buildQueryParams(),
  });

  const { dataProducts: normalized } = useProducts(data);
  dataProducts.value = normalized.value;
};

watch(selectedFilters, fetchProducts, { deep: true, immediate: true });

watch(
  () => route.query.subcategory,
  () => {
    fetchProducts();
  },
  { deep: true, immediate: true }
);

const init = async () => {
  const { data } = await $axios.get("/filters");
  filters.value = data;

  const subRes = await $axios.get("/subcategoryes", {
    params: { category: route.params.category_id },
  });
  subcategoryes.value = subRes.data;

  await fetchProducts();
};

await init();
</script>

<style scoped></style>
