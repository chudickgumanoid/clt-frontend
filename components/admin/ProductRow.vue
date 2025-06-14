<template>
  <div class="flex bg-[#888888] rounded-2xl p-4 items-center gap-4 text-white">
    <div
      class="w-[80px] h-[80px] bg-red-800 rounded-md shrink-0 overflow-hidden"
    >
      <ApiImg
        v-if="product.image"
        :image-id="product.image"
        alt="product image"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="text-sm w-[80px] whitespace-nowrap">{{ product.price }} тг</div>

    <div class="flex flex-wrap gap-2 grow">
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.name || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.mark || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.model || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.generation || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.part_number || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.vincode || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.quality || "—" }}
      </span>
      <span class="bg-gray-600 px-4 py-1 rounded-full text-xs">
        {{ product.state || "—" }}
      </span>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        class="text-lg cursor-pointer"
        @click="changeCount('remove')"
      >
        −
      </button>
      <span>{{ count }} {{ product.unit_of_m || "шт" }}</span>
      <button
        class="text-lg cursor-pointer"
        @click="changeCount('add')"
      >
        +
      </button>
    </div>

    <button
      @click="removeProduct"
      class="text-xl ml-4"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ApiImg from "../UI/ApiImg.vue";
const props = defineProps({
  product: Object,
});
const { $axios } = useNuxtApp();

const count = ref(props.product.count || 1);

const changeCount = async (action) => {
  try {
    await $axios.post("/productActions", {
      productId: props.product.id,
      action,
    });

    if (action === "add") count.value++;
    else if (action === "remove" && count.value > 0) count.value--;
  } catch (e) {
    alert("Ошибка при обновлении количества");
  }
};

const removeProduct = async () => {
  try {
    await $axios.delete(`/products?productId=${props.product.id}`);
    alert("Успешно удалено");
  } catch (e) {
    alert("Ошибка при удалении");
  }
};
</script>
