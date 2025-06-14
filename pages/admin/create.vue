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
        <ul class="mt-4 text-sm text-gray-600">
          <li
            v-for="(file, i) in form.images"
            :key="i"
          >
            {{ file.name }}
          </li>
        </ul>
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
            placeholder="Номер партнера"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
          <input
            v-model="form.state"
            placeholder="Состояние"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
          <input
            v-model="form.mark"
            placeholder="Марка авто"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
          <input
            v-model="form.unit"
            placeholder="Единица измерения"
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
          <input
            v-model="form.vincode"
            placeholder="Винкод"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
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
          <input
            v-model="form.quality"
            placeholder="Качество"
            class="bg-[#7E7D7D] px-4 py-2 rounded-full h-12"
          />
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
          class="bg-primary text-white px-6 py-2 mt-4 rounded-full hover:bg-green-600 transition self-end"
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
        params: { category: categoryId },
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

const handleFileUpload = (e) => {
  form.value.images = Array.from(e.target.files);
};

const handleDrop = (e) => {
  const files = Array.from(e.dataTransfer.files);
  form.value.images = files;
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
</script>

<style scoped></style>
