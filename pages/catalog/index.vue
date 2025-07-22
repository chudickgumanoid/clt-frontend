<template>
  <div class="max-sm:-mt-10">
    <div class="container">
      <div class="flex flex-col gap-15 max-sm:gap-8">
        <div class="sticky top-0 z-10 py-4 max-sm:static">
          <div
            class="flex justify-between items-center max-sm:flex-col max-sm:items-stretch max-sm:gap-4"
          >
            <div class="flex gap-6">
              <nuxt-link
                :to="$localePath('/')"
                class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all max-sm:text-base max-sm:px-4 max-sm:py-2 max-sm:w-fit h-fit"
              >
                {{ $t("Назад") }}
              </nuxt-link>

              <div
                class="sticky top-[100px] hidden max-sm:flex self-start h-fit flex-col max-sm:flex-row max-sm:flex-wrap gap-2 max-h-[383px] max-sm:max-h-auto overflow-y-auto pr-20 max-sm:static max-sm:overflow-visible max-sm:pr-0"
              >
                <template v-if="!subcategoryes.length">
                  <template
                    v-for="category in categoryesData"
                    :key="category.id"
                  >
                    <nuxt-link
                      :to="$localePath(`/catalog?category=${category.id}`)"
                      class="max-sm:w-auto"
                    >
                      <CategoryTag
                        :label="category.name"
                        class="cursor-pointer"
                      />
                    </nuxt-link>
                  </template>
                </template>
                <template v-else>
                  <template
                    v-for="subcategory in subcategoryes"
                    :key="subcategory.id"
                  >
                    <nuxt-link
                      :to="
                        $localePath(
                          `/catalog?category=${route.query.category}&subcategory=${subcategory.id}`
                        )
                      "
                    >
                      <CategoryTag
                        :label="subcategory.name"
                        class="cursor-pointer"
                      />
                    </nuxt-link>
                  </template>
                </template>
              </div>
            </div>

            <div class="flex gap-6 max-sm:flex-col max-sm:gap-2">
              <FilterBar
                v-model="selectedFilters"
                :filters="filters"
              />

              <nuxt-link
                :to="$localePath('/cart')"
                class="self-end max-sm:hidden"
              >
                <LazyCartButton />
              </nuxt-link>
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-[auto_2fr] gap-8 max-sm:grid-cols-1 max-sm:gap-6"
        >
          <div
            class="sticky top-[100px] max-sm:hidden self-start h-fit flex flex-col max-sm:flex-row max-sm:flex-wrap gap-2 max-h-[383px] max-sm:max-h-auto overflow-auto pr-20 max-sm:static max-sm:overflow-visible max-sm:pr-0"
          >
            <template v-if="!subcategoryes.length">
              <template
                v-for="category in categoryesData"
                :key="category.id"
              >
                <nuxt-link
                  :to="$localePath(`/catalog?category=${category.id}`)"
                  class="max-sm:w-auto"
                >
                  <CategoryTag
                    :label="t(category.i18nKey)"
                    class="cursor-pointer"
                  />
                </nuxt-link>
              </template>
            </template>
            <template v-else>
              <template
                v-for="subcategory in subcategoryes"
                :key="subcategory.id"
              >
                <nuxt-link
                  :to="
                    $localePath(
                      `/catalog?category=${route.query.category}&subcategory=${subcategory.id}`
                    )
                  "
                >
                  <CategoryTag
                    :label="t(subcategory.i18nKey)"
                    class="cursor-pointer"
                  />
                </nuxt-link>
              </template>
            </template>
          </div>

          <div class="grid grid-cols-3 gap-14 gap-y-8 max-sm:grid-cols-1">
            <template v-if="dataProducts.length">
              <ProductCard
                v-for="item in dataProducts"
                :key="item.id"
                :product="item"
              />
            </template>
            <div v-else>{{ $t("Список пуст") }}</div>
          </div>
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
import { ref, watch } from "vue";
import FilterBar from "~/components/category/FilterBar.vue";
import ProductCard from "~/components/products/ProductCard.vue";
import { useProductsRef } from "~/shared/utils/useProducts";
useHead({ title: "Каталог" });

const { t } = useI18n();

const route = useRoute();
const { $axios } = useNuxtApp();

const selectedFilters = ref({});

const { data: filters } = await useAsyncData("filters", () =>
  $axios.get("/filters").then((r) => r.data)
);

function normalizeKey(russianString) {
  return russianString
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[\u00A0\u2000-\u200B]/g, " ")
    .replace(/[^a-zа-я0-9\s]/gi, "")
    .trim()
    .replace(/\s+/g, "_");
}

const { data: categoryesData } = await useAsyncData("categoryes", () =>
  $axios.get("/categoryes").then((r) =>
    r.data.filter(item => item.name !== "Аксессуары").map((item) => ({
      ...item,
      i18nKey: normalizeKey(item.name),
    }))
  )
);

const { data: subcategoryes } = await useAsyncData(
  "subcategoryes",
  () => {
    if (!route.query.category) return [];
    return $axios
      .get("/subcategoryes", { params: { categoryId: route.query.category } })
      .then((r) =>
        r.data.map((item) => ({
          ...item,
          i18nKey: item.name,
        }))
      );
  },
  {
    watch: [() => route.query.category],
  }
);

const rawProducts = ref([]);

const fetchProducts = async () => {
  const { data } = await $axios.get("/products", {
    params: {
      categoryId: route.query.category,
      subcategoryId: route.query.subcategory,
      ...Object.fromEntries(
        Object.entries(selectedFilters.value).map(([k, v]) => [
          k,
          Array.isArray(v) ? v.join(",") : v,
        ])
      ),
    },
  });

  rawProducts.value = data;
};

await fetchProducts();

watch(selectedFilters, fetchProducts, { deep: true });

watch(() => [route.query.category, route.query.subcategory], fetchProducts);

const { dataProducts } = useProductsRef(rawProducts);
</script>

<style scoped></style>
