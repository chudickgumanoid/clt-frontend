<template>
  <div
    class="flex bg-[#888888] rounded-2xl p-4 items-center justify-between gap-4 text-white"
  >
    <div class="flex gap-2 h-fit">
      <div class="flex flex-col gap-2 items-center">
        <div
          class="w-[120px] h-[120px] bg-red-800 rounded-md shrink-0 overflow-hidden"
        >
          <ApiImg
            v-if="product.image"
            :image-id="product.image"
            alt="product image"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="text-sm">
          {{ tengeFormat(product.price) }}
        </div>
      </div>
      <div class="grid grid-cols-4 gap-x-1 gap-y-5 h-fit">
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.name || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.mark || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.model || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.generation || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.part_number || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.vincode || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.quality || "—" }}
        </div>
        <div class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center">
          {{ product.state || "—" }}
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex items-end text-2xl gap-2 shrink-0">
        <button
          class="text-2xl cursor-pointer"
          @click="changeCount('remove')"
        >
          −
        </button>
        <span>{{ count }} {{ product.unit_of_m || "шт" }}</span>
        <button
          class="text-2xl cursor-pointer"
          @click="changeCount('add')"
        >
          +
        </button>
      </div>
      <button
        class="text-5xl ml-4 -mt-18"
        @click="removeProduct"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { tengeFormat } from "~/shared/utils/currencyFormat";
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
  } catch (e) {
    alert("Ошибка при удалении");
  }
};
</script>
