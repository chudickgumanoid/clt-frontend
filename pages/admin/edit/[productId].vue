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
        <div
          v-for="(img, idx) in imagePreviews"
          :key="idx"
          class="relative w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg border"
        >
          <img
            :src="img.url"
            class="object-cover w-full h-full"
          />
          <button
            class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            @click="removeImage(idx)"
          >
            ×
          </button>
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
          Сохранить изменения
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { BASE_API_URL } from "~/shared/utils/constants";
import { useNotification } from "~/shared/utils/useNotification";

definePageMeta({
  middleware: "admin-auth-client",
});

const { notify } = useNotification();
const { $axios } = useNuxtApp();
const route = useRoute();
const productId = route.params.productId;

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
  partNumber: "",
  images: [],
  imageId: [],
  productId: route.params.productId,
});

const imagePreviews = ref([]);
const categoryOptions = ref([]);
const subcategoryOptions = ref([]);
const errors = ref({
  category: false,
  subcategory: false,
  images: false,
});

const qualities = ref([]);
const states = ref([]);

onMounted(async () => {
  const { data: filters } = await $axios.get("/filters");
  for (const f of filters) {
    if (f.filter === "Качество") qualities.value = f.options;
    if (f.filter === "Состояние") states.value = f.options;
  }

  await loadCategories();
  await fetchProduct();
});

const loadCategories = async () => {
  const { data } = await $axios.get("/categoryes");
  categoryOptions.value = data.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
};

watch(
  () => form.value.category,
  async (categoryId) => {
    if (!categoryId) return;
    const { data } = await $axios.get("/subcategoryes", {
      params: { categoryId },
    });
    subcategoryOptions.value = data.map((sub) => ({
      label: sub.name,
      value: sub.id,
    }));
  }
);

const fetchProduct = async () => {
  try {
    const { data } = await $axios.get(`/products?productId=${productId}`);
    const item = data[0];

    form.value.category = item.category;

    const { data: subData } = await $axios.get("/subcategoryes", {
      params: { categoryId: item.category },
    });

    subcategoryOptions.value = subData.map((sub) => ({
      label: sub.name,
      value: sub.id,
    }));

    Object.assign(form.value, {
      name: item.name,
      quality: item.quality,
      mark: item.mark,
      model: item.model,
      count: item.count,
      subcategory: item.subcategory,
      vincode: item.vincode,
      state: item.state,
      price: item.price,
      unit: item.unit_of_m,
      generation: item.generation,
      partNumber: item.part_number,
      imageId: item.images || [],
    });

    imagePreviews.value =
      item.images?.map((imgId) => ({
        url: `${BASE_API_URL}/image?imageId=${imgId}`,
        file: null,
        id: imgId,
      })) || [];
  } catch (e) {
    notify({
      message: `Ошибка загрузки данных: ${e.message}`,
      type: "error",
    });
  }
};

const removeImage = (idx) => {
  const removed = imagePreviews.value[idx];

  if (removed.id) {
    form.value.imageId = form.value.imageId.filter((id) => id !== removed.id);
  }

  imagePreviews.value.splice(idx, 1);
};

const updateImagePreviews = (files) => {
  const newPreviews = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  imagePreviews.value.push(...newPreviews);
  form.value.images.push(...files);
};

const handleFileUpload = (e) => {
  updateImagePreviews(Array.from(e.target.files));
};

const handleDrop = (e) => {
  updateImagePreviews(Array.from(e.dataTransfer.files));
};

const submitProduct = async () => {
  const fd = new FormData();

  form.value.imageId.forEach((id) => fd.append("imageId", id));

  imagePreviews.value.forEach((img) => {
    if (img.file) fd.append("images", img.file);
  });

  for (const [key, val] of Object.entries(form.value)) {
    if (key !== "images" && key !== "imageId") {
      fd.append(key, val);
    }
  }

  const token = localStorage.getItem("token");
  if (token) {
    fd.append("access_token", token);
  }

  try {
    await $axios.patch(`/products`, fd);
    notify({
      message: "Изменения сохранены!",
      type: "success",
    });
  } catch (e) {
    notify({
      message: `Ошибка при обновлении: ${e.message}`,
      type: "error",
    });
  }
};
</script>
