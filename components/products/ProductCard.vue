<template>
  <div
    class="bg-[#5D5D5D] rounded-[20px] p-4 text-white flex flex-col max-sm:flex-row items-center w-full max-w-[258px] max-sm:max-w-full gap-2 max-sm:gap-4"
  >
    <ApiImg
      :image-id="props.product.images[0]"
      alt="Product"
      class="object-contain w-full max-sm:max-w-[150px]"
    />

    <div class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-3">
        <div class="text-lg">{{ props.product.name }}</div>
        <div class="text-sm">{{ props.product.description }}</div>
        <div class="text-lg">
          {{ tengeFormat(props.product.price) }}
        </div>
      </div>
      <div class="flex items-center justify-between gap-2 w-full">
        <nuxt-link :to="$localePath(`/product/${props.product.id}`)">
          <MButton> {{ $t("Смотреть") }} </MButton>
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
import { BASE_API_URL } from "~/shared/utils/constants";

const { t } = useI18n();

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
    console.log(props.product, 'props.product.image')  
    cart.value.push({
      ...props.product,
      quantity: 1,
      image: `${BASE_API_URL}/image?imageId=${props.product.images[0]}`,
    });
  }
};
</script>
