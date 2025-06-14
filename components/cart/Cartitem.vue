<template>
  <div
    class="flex max-sm:flex-col max-sm:items-center items-start justify-between gap-4 p-4 rounded-[20px] bg-[#7E7D7D] text-white w-full max-w-[600px]"
  >
    <!-- Изображение -->
    <div class="w-[218px] h-[218px] max-sm:w-[140px] max-sm:h-[140px] shrink-0">
      <img
        :src="product.image"
        alt="image"
        class="object-contain w-full h-full rounded-xl"
      />
    </div>

    <!-- Название и описание -->
    <div class="flex-1 max-sm:text-center">
      <div class="text-3xl max-sm:text-xl font-semibold">
        {{ product.name }}
      </div>
      <div class="text-2xl max-sm:text-sm whitespace-pre-line">
        {{ product.description }}
      </div>
    </div>

    <!-- Кол-во и цена -->
    <div class="flex flex-col items-end max-sm:items-center gap-2">
      <div class="flex items-center gap-2 text-white">
        <button
          v-if="!props.isNotEdit"
          class="text-xl px-2 cursor-pointer p-2 max-sm:p-1"
          @click="decrease"
        >
          –
        </button>
        <span class="text-2xl max-sm:text-base">{{ product.quantity }} шт</span>
        <button
          v-if="!props.isNotEdit"
          class="text-xl px-2 cursor-pointer p-2 max-sm:p-1"
          @click="increase"
        >
          +
        </button>
      </div>
      <div class="text-3xl max-sm:text-xl font-bold">
        {{ tengeFormat(totalPrice) }}
      </div>
    </div>

    <!-- Кнопка удаления -->
    <button
      v-if="!props.isNotEdit"
      class="text-xl px-2 absolute top-2 right-2 max-sm:static max-sm:self-end"
      @click="$emit('remove')"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { tengeFormat } from "~/shared/utils/currencyFormat";

const props = defineProps({
  product: Object,
  isNotEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-quantity", "remove"]);

const increase = () => {
  emit("update-quantity", { id: props.product.id, delta: 1 });
};

const decrease = () => {
  if (props.product.quantity > 1) {
    emit("update-quantity", { id: props.product.id, delta: -1 });
  }
};

const totalPrice = computed(() => {
  return props.product.price * props.product.quantity;
});
</script>
