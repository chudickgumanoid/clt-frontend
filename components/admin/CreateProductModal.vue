<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
  >
    <div class="bg-white text-black p-6 rounded-xl w-full max-w-xl relative">
      <button
        class="absolute top-4 right-4 text-lg"
        @click="$emit('update:modelValue', false)"
      >
        ✕
      </button>
      <h2 class="text-xl font-bold mb-4">Добавить запчасть</h2>

      <form
        class="flex flex-col gap-3"
        @submit.prevent="submitProduct"
      >
        <input
          v-model="form.name"
          placeholder="Название"
          required
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.quality"
          placeholder="Качество"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.mark"
          placeholder="Марка авто"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.model"
          placeholder="Модель авто"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model.number="form.count"
          type="number"
          placeholder="Количество"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.category"
          placeholder="ID категории"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.subcategory"
          placeholder="ID подкатегории"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.vincode"
          placeholder="Винкод"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.state"
          placeholder="Состояние"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.price"
          type="number"
          placeholder="Цена"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          v-model="form.unit"
          placeholder="Ед. измерения"
          class="px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          multiple
          class="px-4 py-2 border border-gray-300 rounded"
          @change="handleFileUpload"
        />

        <button
          type="submit"
          class="bg-primary text-white px-6 py-2 mt-2 rounded-full hover:bg-green-600 transition"
        >
          Сохранить
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue", "success"]);
import { useNotification } from "~/shared/utils/useNotification";
const { notify } = useNotification();

const props = defineProps({
  modelValue: Boolean,
});

const { $axios } = useNuxtApp();

const form = ref({
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
  images: [],
});

const handleFileUpload = (e) => {
  form.value.images = Array.from(e.target.files);
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

  try {
    await $axios.post("/products", fd);
    emit("update:modelValue", false);
    emit("success");
  } catch (e) {
    notify({
      message: `Ошибка при обновлении количества ${e.message}`,
      type: "error",
      duration: 3000,
    });
  }
};
</script>
