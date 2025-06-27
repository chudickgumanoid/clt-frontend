<template>
  <div class="container">
    <div class="flex flex-col gap-15 max-sm:gap-0 max-sm:-mt-10">
      <div class="sticky top-0 z-10 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4 max-sm:hidden">
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

      <div
        class="grid grid-cols-[auto_2fr] max-sm:grid-cols-1 gap-10 max-sm:gap-4"
      >
        <div
          class="sticky top-[100px] w-full self-start h-fit flex flex-col max-sm:flex-row max-sm:flex-wrap gap-2 max-h-[383px] max-sm:max-h-auto overflow-auto pr-20 max-sm:overflow-visible max-sm:pr-0 max-sm:max-h-full max-sm:items-center max-sm:justify-center max-sm:max-w-[240px] max-sm:mx-auto max-sm:static"
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
                <div class="ml-4 mt-2 space-y-2 max-sm:absolute">
                  <div class="bg-[#5D5D5D] rounded-2xl py-4 w-[116%]">
                    <button
                      class="text-white text-sm px-1 py-1 rounded w-full"
                      @click="
                        () => {
                          newSubcategoryVisible = !newSubcategoryVisible;
                          newSubcategory.value.category =
                            selectedCategoryId.value;
                        }
                      "
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
                    class="flex items-center gap-2"
                  >
                    <CategoryTag
                      :label="subcategory.name"
                      class="cursor-pointer"
                      @click="navigateToCategoryAndSub(subcategory.id)"
                    />
                    <button
                      class="text-white cursor-pointer bg-gray-secondary flex items-center justify-center min-h-8 min-w-8 h-8 w-8 rounded font-bold text-lg"
                      title="Удалить подкатегорию"
                      @click="deleteSubcategory(subcategory.id)"
                    >
                      ✕
                    </button>
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
            @deleted="fetchProducts"
          />
        </div>
      </div>

      <div class="hidden max-sm:flex justify-around my-6">
        <nuxt-link
          class="bg-gray-secondary text-white px-6 py-2 rounded-full max-w-[100px] text-[11px] flex items-center justify-center"
          to="/admin/create"
        >
          Добавить запчасть
        </nuxt-link>
        <nuxt-link
          to="/admin/dashboard"
          class="bg-gray-secondary text-white px-6 py-2 rounded-full max-w-[100px] text-[11px] flex items-center justify-center"
        >
          Дашборд
        </nuxt-link>
      </div>

      <div class="flex items-center gap-4">
        <FilterBar
          v-model="selectedFilters"
          :filters="filters"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ProductRow from "~/components/admin/ProductRow.vue";
import FilterBar from "~/components/category/FilterBar.vue";
import { useNotification } from "~/shared/utils/useNotification";
import { useProductsRef } from "~/shared/utils/useProducts";

const { notify } = useNotification();

definePageMeta({
  middleware: "admin-auth-client",
});

useHead({ title: "Admin" });

const route = useRoute();
const { $axios } = useNuxtApp();

const selectedFilters = ref({});

const { data: filters } = await useAsyncData("filters", () =>
  $axios.get("/filters").then((r) => r.data)
);

const { data: categoryesData } = await useAsyncData("categoryes", () =>
  $axios.get("/categoryes").then((r) => r.data)
);

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

const newSubcategoryVisible = ref(false);
const newSubcategory = ref({ name: "", category: route.query.category });

watch(
  () => route.query.category,
  (newVal) => {
    newSubcategory.value.category = newVal;
  }
);

const createSubcategory = async () => {
  if (!newSubcategory.value.name) {
    notify({
      message: `Заполните все поля`,
      type: "error",
      duration: 3000,
    });
    return;
  }
  const token = localStorage.getItem("token");
  try {
    await $axios.post("/subcategoryes", {
      name: newSubcategory.value.name,
      categoryId: newSubcategory.value.category || selectedCategoryId.value,
      access_token: token,
    });

    newSubcategory.value.name = "";
    await fetchProducts();
    notify({
      message: `Подкатегория добавлена`,
      type: "success",
      duration: 3000,
    });
  } catch (e) {
    notify({
      message: `Ошибка при обновлении количества ${e.message}`,
      type: "error",
      duration: 5000,
    });
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

const deleteSubcategory = async (subcategoryId) => {
  const token = localStorage.getItem("token");
  try {
    await $axios.delete(
      `/subcategoryes?subcategoryId=${subcategoryId}&access_token=${token}`
    );
    notify({
      message: "Подкатегория удалена",
      type: "success",
      duration: 3000,
    });
    // Обновить список подкатегорий
    if (selectedCategoryId.value) {
      await loadSubcategories(selectedCategoryId.value);
    }
  } catch (e) {
    notify({
      message: `Ошибка при удалении: ${e.message}`,
      type: "error",
      duration: 5000,
    });
  }
};
</script>

<style scoped></style>
