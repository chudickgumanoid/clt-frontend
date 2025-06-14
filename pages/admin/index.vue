<template>
  <div class="container">
    <div class="flex flex-col gap-15">
      <!-- Top bar -->
      <div class="sticky top-0 z-10 py-4">
        <div class="flex justify-between items-center">
          <nuxt-link
            to="/"
            class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all"
          >
            Назад
          </nuxt-link>

          <div class="flex items-center gap-4">
            <FilterBar
              v-model="selectedFilters"
              :filters="filters"
            />

            <nuxt-link
              class="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
              to="/admin/create"
            >
              Добавить запчасть
            </nuxt-link>

            <nuxt-link
              to="/admin/dashboard"
              class="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
            >
              Дашборд
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Category grid -->
      <div class="grid grid-cols-[auto_2fr] gap-10">
        <div
          class="sticky top-[100px] self-start h-fit flex flex-col gap-2 max-h-[383px] overflow-auto pr-20"
        >
          <template v-if="subcategoryes.length">
            <nuxt-link
              v-for="subcategory in subcategoryes"
              :key="subcategory.id"
              :to="`/catalog/${route.params.category_id}?subcategory=${subcategory.id}`"
            >
              <CategoryTag :label="subcategory.name" />
            </nuxt-link>
          </template>
          <div v-else>Список пуст</div>
          <div class="mt-4 p-2 border-t border-gray-300 pt-4">
            <form
              class="flex flex-col gap-2"
              @submit.prevent="createSubcategory"
            >
              <select
                v-model="newSubcategory.category"
                class="bg-[#7E7D7D] text-white px-3 py-2 rounded-full"
              >
                <option
                  disabled
                  value=""
                >
                  Выберите категорию
                </option>
                <option
                  v-for="cat in categoryOptions"
                  :key="cat.value"
                  :value="cat.value"
                >
                  {{ cat.label }}
                </option>
              </select>

              <input
                v-model="newSubcategory.name"
                placeholder="Название подкатегории"
                class="bg-[#7E7D7D] text-white px-3 py-2 rounded-full"
              />

              <button
                type="submit"
                class="bg-primary text-white px-4 py-2 rounded-full hover:bg-green-600 transition self-start"
              >
                ➕ Создать подкатегорию
              </button>
            </form>
          </div>
        </div>

        <div class="flex flex-col gap-4">
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
import CreateProductModal from "~/components/admin/CreateProductModal.vue";
import ProductRow from "~/components/admin/ProductRow.vue";
import FilterBar from "~/components/category/FilterBar.vue";
import { useProducts } from "~/shared/utils/useProducts";
definePageMeta({
  middleware: "admin-auth-client",
});

useHead({ title: "Admin" });

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

const showModal = ref(false);

const newSubcategory = ref({
  name: "",
  category: route.params.category_id || "",
});

const categoryOptions = ref([]);
onMounted(async () => {
  const { data } = await $axios.get("/categoryes");
  categoryOptions.value = data.map((c) => ({ label: c.name, value: c.id }));
});

const createSubcategory = async () => {
  if (!newSubcategory.value.name || !newSubcategory.value.category)
    return alert("Заполните все поля");
  const token = localStorage.getItem("token");
  try {
    await $axios.post("/subcategoryes", {
      name: newSubcategory.value.name,
      categoryId: newSubcategory.value.category,
      access_token: token,
    });
    alert("Подкатегория создана");

    newSubcategory.value.name = "";
    await init();
  } catch (e) {
    alert("Ошибка при создании");
  }
};
</script>

<style scoped></style>
