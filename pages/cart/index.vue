<template>
  <section class="container">
    <div class="flex flex-col gap-14">
      <div>
        <nuxt-link
          to="/"
          class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all"
        >
          Назад
        </nuxt-link>
      </div>

      <div class="bg-[#4B4B4B] rounded-3xl p-6 flex flex-col gap-6">
        <div
          v-if="cart.length"
          class="flex flex-col gap-4"
        >
          <div
            v-for="item in cart"
            :key="item.id"
          >
            <Cartitem
              :product="item"
              @update-quantity="handleQuantityChange"
              @remove="removeItem(item.id)"
            />
          </div>
        </div>
        <div
          v-else
          class="text-white text-xl text-center"
        >
          Корзина пуста
        </div>

        <div
          v-if="cart.length"
          class="flex justify-end items-end flex-col gap-6"
        >
          <div class="flex flex-col gap-3 text-3xl">
            <div>Общее количество: {{ currencyFormat(totalQty) }} шт</div>
            <div>Общая стоимость: {{ tengeFormat(totalSum) }}</div>
          </div>

          <div class="flex">
            <MButton @click="router.push('/cart/bue')">
              Оформить заказ
            </MButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Cartitem from "~/components/cart/Cartitem.vue";
import MButton from "~/components/UI/MButton.vue";
import { currencyFormat, tengeFormat } from "~/shared/utils/currencyFormat";

useHead({ title: "Корзина" });

const router = useRouter();
const cart = useLocalStorage("cart", []);

const handleQuantityChange = ({ id, delta }) => {
  const item = cart.value.find((p) => p.id === id);
  if (item) item.quantity = Math.max(1, item.quantity + delta);
};

const removeItem = (id) => {
  cart.value = cart.value.filter((p) => p.id !== id);
};

const totalQty = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity, 0)
);

const totalSum = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
</script>
