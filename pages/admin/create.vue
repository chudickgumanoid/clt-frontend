<template>
  <div class="">
    <div
      class="rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8 max-w-6xl mx-auto"
    >
      <!-- Drag-and-drop загрузка слева -->
      <div
        class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 text-center"
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
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
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

          <select
            v-model="form.mark"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          >
            <option
              disabled
              value=""
            >
              Марка авто
            </option>
            <option
              v-for="mark in carMarks"
              :key="mark.id"
              :value="mark.value"
            >
              {{ mark.value }}
            </option>
          </select>

          <select
            v-model="form.model"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          >
            <option
              disabled
              value=""
            >
              Модель
            </option>
            <option
              v-for="model in carModels[form.mark] || []"
              :key="model.id"
              :value="model.value"
            >
              {{ model.value }}
            </option>
          </select>

          <input
            v-model.number="form.count"
            type="number"
            placeholder="Количество"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />

          <select
            v-model="form.generation"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          >
            <option
              disabled
              value=""
            >
              Поколение
            </option>
            <option
              v-for="gen in generations"
              :key="gen.id"
              :value="gen.value"
            >
              {{ gen.value }}
            </option>
          </select>

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
          <span class="text-lg font-semibold">{{
            form.price ? form.price + " тг" : ""
          }}</span>
          <input
            v-model.number="form.price"
            type="number"
            placeholder="Цена"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
        </div>

        <button
          type="submit"
          class="bg-white text-primary px-6 py-2 mt-4 rounded-lg text-2xl self-end"
        >
          Добавить
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
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
      form.value.subcategory = ""; // сброс при смене категории
    } catch (err) {
      console.error("Ошибка при загрузке подкатегорий:", err);
      subcategoryOptions.value = [];
    }
  }
);

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
};

const handleDrop = (e) => {
  updateImagePreviews(Array.from(e.dataTransfer.files));
};

const submitProduct = async () => {
  const fd = new FormData();
  for (const [key, val] of Object.entries(form.value)) {
    if (key === "images") {
      val.forEach((file) => fd.append("images", file));
    } else {
      fd.append(key, val);
    }
  }

  // токен сразу в FormData, без записи в form
  const token = localStorage.getItem("token");
  if (token) {
    fd.append("access_token", token);
  }

  try {
    await $axios.post("/products", fd);
    alert("Успешно добавлено");
  } catch {
    alert("Ошибка при добавлении");
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
          carModels.value = filter.options[0]; // внутри один объект с ключами-брендами
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
