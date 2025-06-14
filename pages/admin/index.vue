<template>
  <div class="container">
    <div class="flex flex-col gap-15">
      <!-- Top bar -->
      <div class="sticky top-0 z-10 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <FilterBar
              v-model="selectedFilters"
              :filters="filters"
            />

            <nuxt-link
              class="bg-gray-secondary text-white px-6 py-2 rounded-full"
              to="/admin/create"
            >
              Добавить запчасть
            </nuxt-link>

            <nuxt-link
              to="/admin/dashboard"
              class="bg-gray-secondary text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
            >
              Дашборд
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-[auto_2fr] gap-10">
        <div
          class="sticky top-[100px] w-full self-start h-fit flex flex-col max-sm:flex-row max-sm:flex-wrap gap-2 max-h-[383px] max-sm:max-h-auto overflow-auto pr-20 max-sm:static max-sm:overflow-visible max-sm:pr-0"
        >
          <template
            v-for="category in categoryesData"
            :key="category.id"
          >
            <div>
              <CategoryTag
                :label="category.name"
                class="cursor-pointer"
                @click="loadSubcategories(category.id)"
              />

              <!-- Подкатегории для выбранной категории -->
              <template v-if="selectedCategoryId === category.id">
                <div class="ml-4 mt-2 space-y-2">
                  <div class="bg-[#5D5D5D] rounded-2xl py-4 w-[116%]">
                    <button
                      class="text-white text-sm px-1 py-1 rounded w-full"
                      @click="newSubcategoryVisible = !newSubcategoryVisible"
                    >
                      Добавить подкатегорию +
                    </button>
                    <div
                      v-if="newSubcategoryVisible"
                      class="mt-2 flex flex-col gap-10"
                    >
                      <input
                        v-model="newSubcategory.name"
                        placeholder="Название"
                        class="px-4 py-2 rounded-2xl w-[143px] bg-[#9B9B9B] text-white mx-2 mt-4"
                      />
                      <button
                        class="bg-black w-fit mx-auto text-yellow-400 px-4 rounded-2xl"
                        @click="createSubcategory"
                      >
                        Создать
                      </button>
                    </div>
                  </div>

                  <div
                    v-for="subcategory in subcategoryes"
                    :key="subcategory.id"
                  >
                    <CategoryTag
                      :label="subcategory.name"
                      class="cursor-pointer"
                      @click="navigateToCategoryAndSub(subcategory.id)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>

        <div class="flex flex-col gap-4 bg-[#888888] rounded-3xl">
          <ProductRow
            v-for="item in dataProducts"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>
    </div>

    <CreateProductModal
      v-model="showModal"
      @success="fetchProducts"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import CreateProductModal from "~/components/admin/CreateProductModal.vue";
import ProductRow from "~/components/admin/ProductRow.vue";
import FilterBar from "~/components/category/FilterBar.vue";
import { useProductsRef } from "~/shared/utils/useProducts";
definePageMeta({
  middleware: "admin-auth-client",
});

useHead({ title: "Admin" });

const route = useRoute();
const { $axios } = useNuxtApp();

const selectedFilters = ref({});

// SSR: фильтры и категории
const { data: filters } = await useAsyncData("filters", () =>
  $axios.get("/filters").then((r) => r.data)
);

const { data: categoryesData } = await useAsyncData("categoryes", () =>
  $axios.get("/categoryes").then((r) => r.data)
);

// SSR: подкатегории по текущей категории
const { data: subcategoryes } = await useAsyncData(
  "subcategoryes",
  () => {
    if (!route.query.category) return [];
    return $axios
      .get("/subcategoryes", { params: { categoryId: route.query.category } })
      .then((r) => r.data);
  },
  {
    watch: [() => route.query.category],
  }
);

// 🧠 Продукты — отдельный ref, чтобы computed был реактивным
const rawProducts = ref([]);

// 👉 Запрос продуктов (и при фильтрах, и при смене query)
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

// 🔁 Обновляем при смене фильтров
watch(selectedFilters, fetchProducts, { deep: true });
// 🔁 Обновляем при смене query
watch(() => [route.query.category, route.query.subcategory], fetchProducts);

// ✅ computed с нормализацией
const { dataProducts } = useProductsRef(rawProducts);

const newSubcategoryVisible = ref(false);
const newSubcategory = ref({ name: "", category: route.query.category });

watch(
  () => route.query.category,
  (newVal) => {
    newSubcategory.value.category = newVal;
  }
);

const createSubcategory = async () => {
  if (!newSubcategory.value.name || !newSubcategory.value.category) {
    return alert("Заполните все поля");
  }
  const token = localStorage.getItem("token");
  try {
    await $axios.post("/subcategoryes", {
      name: newSubcategory.value.name,
      categoryId: newSubcategory.value.category,
      access_token: token,
    });

    newSubcategory.value.name = "";
    await fetchProducts(); // перезагрузи продукты
  } catch (e) {
    alert("Ошибка при создании");
  }
};

const selectedCategoryId = ref(null);

const loadSubcategories = async (categoryId) => {
  selectedCategoryId.value = categoryId;
  const { data } = await $axios.get("/subcategoryes", {
    params: { categoryId },
  });
  subcategoryes.value = data;
};

const router = useRouter();
const navigateToCategoryAndSub = (subcategoryId) => {
  router.push({
    path: "/admin",
    query: {
      category: selectedCategoryId.value,
      subcategory: subcategoryId,
    },
  });
};
</script>

<style scoped></style>
