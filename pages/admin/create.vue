<template>
  <div class="">
    <div
      class="rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-6xl mx-auto"
    >
      <!-- Drag-and-drop загрузка слева -->
      <div
        class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-center"
        :class="errors.images ? 'border-red-500' : 'border-gray-300'"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <p class="mb-4 text-gray-500">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileUpload"
        />
        <button
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          @click="$refs.fileInput.click()"
        >
          Выбрать файлы
        </button>
        <div class="mt-4 grid grid-cols-3 gap-4">
          <div
            v-for="(img, idx) in imagePreviews"
            :key="idx"
            class="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg border"
          >
            <img
              :src="img.url"
              class="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <!-- Поля формы справа -->
      <form
        class="flex flex-col gap-3"
        @submit.prevent="submitProduct"
      >
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="form.name"
            placeholder="Название"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
          <input
            v-model="form.partNumber"
            placeholder="Партномер"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
          <select
            v-model="form.category"
            :class="[
              'bg-[#7E7D7D] px-4 py-2 rounded-full h-12',
              errors.category && 'border-2 border-red-500',
            ]"
            @blur="clearErrorIfValid('category')"
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

          <select
            v-model="form.subcategory"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
            :class="[
              'bg-[#7E7D7D] px-4 py-2 rounded-full h-12',
              errors.subcategory && 'border-2 border-red-500',
            ]"
            @blur="clearErrorIfValid('subcategory')"
          >
            <option
              disabled
              value=""
            >
              Выберите подкатегорию
            </option>
            <option
              v-for="sub in subcategoryOptions"
              :key="sub.value"
              :value="sub.value"
            >
              {{ sub.label }}
            </option>
          </select>

          <select
            v-model="form.state"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          >
            <option
              disabled
              value=""
            >
              Состояние
            </option>
            <option
              v-for="s in states"
              :key="s.id"
              :value="s.value"
            >
              {{ s.value }}
            </option>
          </select>

          <select
            v-model="form.unit"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          >
            <option
              disabled
              value=""
            >
              Ед. изм.
            </option>
            <option>Шт.</option>
            <option>Литры</option>
            <option>Кг</option>
          </select>

          <input
            v-model="form.mark"
            placeholder="Марка авто"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />

          <input
            v-model="form.model"
            placeholder="Модель"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />

          <input
            v-model.number="form.count"
            type="number"
            placeholder="Количество"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />

          <input
            v-model="form.generation"
            placeholder="Поколение"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />

          <input
            v-model="form.vincode"
            placeholder="Винкод"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />

          <select
            v-model="form.quality"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          >
            <option
              disabled
              value=""
            >
              Качество
            </option>
            <option
              v-for="q in qualities"
              :key="q.id"
              :value="q.value"
            >
              {{ q.value }}
            </option>
          </select>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <span class="text-lg font-semibold">
            {{ form.price ? form.price + " тг" : "" }}
          </span>
          <input
            v-model.number="form.price"
            type="number"
            placeholder="Цена"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
        </div>

        <button
          type="submit"
          class="bg-white text-primary px-6 py-2 mt-4 rounded-lg text-2xl self-end cursor-pointer"
        >
          Добавить
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useNotification } from "~/shared/utils/useNotification";

const { notify } = useNotification();

definePageMeta({
  middleware: "admin-auth-client",
});

const { $axios } = useNuxtApp();

const form = ref({
  access_token: "",
  name: "",
  quality: "",
  mark: "",
  model: "",
  count: 1,
  category: "",
  subcategory: "",
  vincode: "",
  state: "",
  price: "",
  unit: "",
  generation: "",
  images: [],
  partNumber: "",
});

const categoryOptions = ref([]);
const subcategoryOptions = ref([]);
const { data } = await $axios.get("/categoryes");
categoryOptions.value = data.map((cat) => ({
  label: cat.name,
  value: cat.id,
}));

watch(
  () => form.value.category,
  async (categoryId) => {
    if (!categoryId) return;
    try {
      const { data } = await $axios.get("/subcategoryes", {
        params: { categoryId: categoryId },
      });
      subcategoryOptions.value = data.map((sub) => ({
        label: sub.name,
        value: sub.id,
      }));
      form.value.subcategory = "";
    } catch (err) {
      console.error("Ошибка при загрузке подкатегорий:", err);
      subcategoryOptions.value = [];
    }
  }
);

const errors = ref({
  category: false,
  subcategory: false,
  images: false,
});

const validateForm = () => {
  let isValid = true;
  const fieldsToCheck = ["category", "subcategory", "images"];

  fieldsToCheck.forEach((field) => {
    const isEmpty =
      !form.value[field] ||
      (Array.isArray(form.value[field]) && form.value[field].length === 0);

    errors.value[field] = isEmpty;
    if (isEmpty) isValid = false;
  });

  return isValid;
};

const clearErrorIfValid = (field) => {
  const val = form.value[field];
  const isEmpty = !val || (Array.isArray(val) && val.length === 0);
  if (!isEmpty) {
    errors.value[field] = false;
  }
};

const imagePreviews = ref([]);

const updateImagePreviews = (files) => {
  form.value.images = files;
  imagePreviews.value = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));
};

const handleFileUpload = (e) => {
  updateImagePreviews(Array.from(e.target.files));
  clearErrorIfValid("images");
};

const handleDrop = (e) => {
  updateImagePreviews(Array.from(e.dataTransfer.files));
  clearErrorIfValid("images");
};

const submitProduct = async () => {
  if (!validateForm()) return;

  const fd = new FormData();
  for (const [key, val] of Object.entries(form.value)) {
    if (key === "images") {
      val.forEach((file) => fd.append("images", file));
    } else {
      fd.append(key, val);
    }
  }

  const token = localStorage.getItem("token");
  if (token) {
    fd.append("access_token", token);
  }

  try {
    await $axios.post("/products", fd);
    notify({
      message: "Успешно добавлено!",
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

const carMarks = ref([]);
const carModels = ref({});
const generations = ref([]);
const qualities = ref([]);
const states = ref([]);

onMounted(async () => {
  try {
    const { data: filters } = await $axios.get("/filters");
    console.log(filters, "filters");
    for (const filter of filters) {
      switch (filter.filter) {
        case "Марка авто":
          carMarks.value = filter.options;
          break;
        case "Модель":
          carModels.value = filter.options[0];
          break;
        case "Поколение":
          generations.value = filter.options;
          break;
        case "Качество":
          qualities.value = filter.options;
          break;
        case "Состояние":
          states.value = filter.options;
          break;
      }
    }
  } catch (err) {
    console.error("Ошибка при загрузке фильтров:", err);
  }
});
</script>

<style scoped></style>
