<template>
  <div
    class="flex bg-[#888888] rounded-2xl p-4 items-center justify-between gap-4 text-white"
    @click="showDetails = !showDetails"
  >
    <div class="flex gap-2 h-fit max-sm:relative">
      <div class="flex flex-col gap-2 items-center">
        <div
          class="w-[120px] h-[120px] max-sm:max-w-[75px] max-sm:max-h-[75px] bg-red-800 rounded-md shrink-0 overflow-hidden"
        >
          <ApiImg
            v-if="product.image"
            :image-id="product.image"
            alt="product image"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="text-sm max-sm:hidden">
          {{ tengeFormat(product.price) }}
        </div>
      </div>
      <div class="grid grid-cols-4 max-sm:grid-cols-1 gap-x-1 gap-y-5 h-fit">
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.name || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.mark || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px] max-sm:hidden"
        >
          {{ product.model || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px] max-sm:hidden"
        >
          {{ product.generation || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px] max-sm:hidden"
        >
          {{ product.part_number || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px] max-sm:hidden"
        >
          {{ product.vincode || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px] max-sm:hidden"
        >
          {{ product.quality || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px] max-sm:hidden"
        >
          {{ product.state || "—" }}
        </div>
      </div>

      <div
        v-if="showDetails"
        class="bg-[#9D9D9D] px-[6px] py-[10px] rounded-[20px] hidden max-sm:grid grid-cols-3 items-center justify-around absolute top-6 w-[287px] translate-x-2/4 -left-2/4 gap-4 z-10"
      >
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.name || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.mark || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.model || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.generation || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.part_number || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.vincode || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.quality || "—" }}
        </div>
        <div
          class="bg-[#7E7D7D] px-4 py-2 rounded-full text-lg text-center max-sm:text-[10px]"
        >
          {{ product.state || "—" }}
        </div>
      </div>
    </div>

    <div class="flex gap-4 max-sm:relative">
      <div
        class="flex items-end max-sm:items-center text-2xl max-sm:text-base gap-2 shrink-0"
      >
        <button
          class="text-2xl cursor-pointer"
          @click.stop="changeCount('remove')"
        >
          −
        </button>
        <span>{{ count }} {{ product.unit_of_m || "шт" }}</span>
        <button
          class="text-2xl cursor-pointer"
          @click.stop="changeCount('add')"
        >
          +
        </button>
      </div>
      <button
        class="text-5xl ml-4 -mt-18 max-sm:absolute max-sm:right-0 max-sm:top-0 max-sm:-mt-10 max-sm:text-4xl"
        @click.stop="removeProduct"
      >
        ×
      </button>
      <button
        class="text-xl bg-yellow-500 px-3 py-1 rounded"
        @click.stop="$router.push(`/admin/edit/${product.id}`)"
      >
        ✎
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { tengeFormat } from "~/shared/utils/currencyFormat";
import { useNotification } from "~/shared/utils/useNotification";
import ApiImg from "../UI/ApiImg.vue";

const showDetails = ref(false);
const { notify } = useNotification();
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
    notify({
      message: `Ошибка при обновлении количества ${e.message}`,
      type: "error",
      duration: 5000,
    });
  }
};

const emit = defineEmits(["deleted"]);
const removeProduct = async () => {
  try {
    await $axios.delete(`/products?productId=${props.product.id}`);
    emit("deleted");
  } catch (e) {
    notify({
      message: `Ошибка при удалении продукта ${e.message}`,
      type: "error",
      duration: 5000,
    });
  }
};
</script>
