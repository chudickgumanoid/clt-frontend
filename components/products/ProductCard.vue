<template>
  <div
    class="bg-[#5D5D5D] rounded-[20px] p-4 text-white flex flex-col max-sm:flex-row items-center w-full max-w-[258px] max-sm:max-w-full gap-2 max-sm:gap-4"
  >
    <ApiImg
      :image-id="props.product.image"
      alt="Product"
      class="object-contain w-full max-sm:max-w-[150px]"
    />

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-3">
        <div class="text-lg">{{ props.product.name }}</div>
        <div class="text-sm">{{ props.product.description }}</div>
        <div class="text-lg">
          {{ tengeFormat(props.product.price) }}
        </div>
      </div>
      <div class="flex items-center justify-between gap-2 w-full">
        <nuxt-link :to="`/product/${props.product.id}`">
          <MButton> Смотреть </MButton>
        </nuxt-link>

        <button
          title="Добавить в корзину"
          class="cursor-pointer"
          @click.stop="addToCart"
        >
          <img
            src="/img/cart.svg"
            class="h-10 max-h-10"
            alt="В корзину"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core";
import { tengeFormat } from "~/shared/utils/currencyFormat";
import ApiImg from "../UI/ApiImg.vue";
import MButton from "../UI/MButton.vue";

const props = defineProps({
  product: Object,
});

const config = useRuntimeConfig();

const cart = useLocalStorage("cart", []);
const addToCart = () => {
  const existing = cart.value.find((item) => item.id === props.product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({
      ...props.product,
      quantity: 1,
      image: `https://98da63106715be00063abd3281040a13.serveo.net/api/image?imageId=${props.product.image}`,
    });
  }
};
</script>
