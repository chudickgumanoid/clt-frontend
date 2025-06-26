<template>
  <div class="flex max-sm:hidden items-start justify-between gap-4">
    <div class="bg-gray-[#7E7D7D] rounded-[20px] w-[218px] h-[218px]">
      <img
        :src="product.image"
        alt="image"
        class="object-contain rounded-xl"
      />
    </div>

    <div class="flex-1">
      <div class="text-3xl">{{ product.name }}</div>
      <div class="text-2xl">
        {{ product.description }}
      </div>
    </div>

    <div class="flex flex-col items-end gap-2">
      <div class="flex items-center gap-2 text-white">
        <button
          v-if="!props.isNotEdit"
          class="text-xl px-2 cursor-pointer p-4"
          @click="decrease"
        >
          –
        </button>
        <span class="text-2xl">{{ product.quantity }} шт</span>
        <button
          v-if="!props.isNotEdit"
          class="text-xl px-2 cursor-pointer p-4"
          @click="increase"
        >
          +
        </button>
      </div>
      <div class="text-3xl">{{ tengeFormat(totalPrice) }}</div>
    </div>

    <button
      v-if="!props.isNotEdit"
      class="text-xl px-2"
      @click="$emit('remove')"
    >
      ×
    </button>
  </div>

  <div class="hidden max-sm:flex gap-2 relative">
    <div class="bg-[#7E7D7D] rounded-[20px] w-[110px] h-[110px] min-w-[110px] min-h-[110px] max-w-[110px] max-h-[110px]">
      <img
        :src="product.image"
        alt="image"
        class="object-contain rounded-xl"
      />
    </div>
    <div class="flex flex-col">
      <div class="flex-1">
        <div class="text-[15px]">{{ product.name }}</div>
        <div class="text-[11px]">
          {{ product.description }}
        </div>
      </div>

      <div class="flex flex-col items-center gap-2">
        <div class="flex items-center gap-2 text-white">
          <button
            v-if="!props.isNotEdit"
            class="text-xl px-2 cursor-pointer p-4"
            @click="decrease"
          >
            –
          </button>
          <span class="text-2xl">{{ product.quantity }} шт</span>
          <button
            v-if="!props.isNotEdit"
            class="text-xl px-2 cursor-pointer p-4"
            @click="increase"
          >
            +
          </button>
        </div>
        <div class="text-base">{{ tengeFormat(totalPrice) }}</div>
      </div>
    </div>

    <button
      v-if="!props.isNotEdit"
      class="text-3xl absolute -top-6 -right-4"
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
