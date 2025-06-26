<template>
  <section class="container relative">
    <div class="flex flex-col gap-14 max-sm:gap-10">
      <div>
        <nuxt-link
          :to="$localePath('/cart')"
          class="bg-gray-secondary text-white px-8 py-2 rounded-4xl text-2xl hover:bg-primary transition-all max-sm:text-[13px]"
        >
          {{ $t("Назад") }}
        </nuxt-link>
      </div>

      <div
        class="grid grid-cols-[2fr_1fr] max-sm:grid-cols-1 gap-16 max-sm:gap-4"
      >
        <div class="bg-[#4B4B4B] rounded-3xl p-6 flex flex-col gap-6 relative">
          <div class="flex">
            <div class="flex flex-col gap-4 w-full">
              <template v-if="cart.length">
                <div
                  v-for="item in cart"
                  :key="item.id"
                >
                  <Cartitem
                    :product="item"
                    :is-not-edit="true"
                  />
                </div>
              </template>
              <div
                v-else
                class="flex justify-center items-center h-full w-full"
              >
                {{ $t("Список пуст") }}
              </div>
            </div>
          </div>
          <div
            v-if="cart.length"
            class="flex justify-end items-end max-sm:items-center max-sm:justify-center flex-col gap-6 sticky bottom-0 bg-[#4B4B4B] py-4"
          >
            <div class="flex flex-col gap-3 text-3xl max-sm:text-base max-sm:text-center">
              <div>
                {{ $t("Общее количество") }}: {{ currencyFormat(totalQty) }} шт
              </div>
              <div>
                {{ $t("Общая стоимость") }}: {{ tengeFormat(totalSum) }}
              </div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="sticky top-10">
            <div class="bg-[#4B4B4B] rounded-3xl px-6 py-4 flex flex-col gap-6">
              <div
                class="bg-[#4B4B4B] rounded-3xl px-6 py-4 flex flex-col gap-6"
              >
                <div class="flex flex-col mx-auto gap-6">
                  <div class="flex flex-col gap-3">
                    <MInput
                      v-model="formState.name"
                      :variant="errors.name ? 'error' : 'big'"
                      :placeholder="t('Имя')"
                    />
                    <MInput
                      v-model="formState.phone"
                      v-maska="'8 (###) ###-##-##'"
                      :variant="errors.phone ? 'error' : 'big'"
                      :placeholder="t('Номер WhatsApp')"
                    />
                    <MInput
                      v-model="formState.address"
                      :variant="errors.address ? 'error' : 'big'"
                      :placeholder="t('Адрес доставки')"
                    />

                    <MInput
                      v-model="formState.dop_phone"
                      v-maska="'8 (###) ###-##-##'"
                      variant="big"
                      :placeholder="t('Дополнительный номер')"
                    />
                    <MInput
                      v-model="formState.promocode"
                      variant="big"
                      :placeholder="t('Промокод')"
                    />
                    <MInput
                      v-model="formState.vincode"
                      variant="big"
                      :placeholder="t('VIN код')"
                    />
                  </div>

                  <p class="text-primary text-base">
                    *{{
                      $t(
                        "Из-за колебаний курса и других внешних обстоятельств цены могут меняться, актуальные цены уточнит менеджер"
                      )
                    }}
                  </p>

                  <MButton @click="send">
                    {{ $t("Отправить заявку") }}
                  </MButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <OrderSuccessModal
      v-if="showSuccess"
      @close="showSuccess = false"
    />
  </section>
</template>

<script setup>
import Cartitem from "~/components/cart/Cartitem.vue";
import OrderSuccessModal from "~/components/cart/OrderSuccessModal.vue";
import MButton from "~/components/UI/MButton.vue";
import MInput from "~/components/UI/MInput.vue";
import { currencyFormat, tengeFormat } from "~/shared/utils/currencyFormat";

const { t } = useI18n();

useHead({
  title: "Оформление заказа",
});

const { $axios } = useNuxtApp();

const formState = ref({
  name: "",
  phone: "",
  address: "",
  additional_phone: "",
  promocode: "",
  vincode: "",
});

const errors = ref({
  name: false,
  phone: false,
  address: false,
});

const validateForm = () => {
  errors.value.name = !formState.value.name.trim();
  errors.value.phone = !formState.value.phone.trim();
  errors.value.address = !formState.value.address.trim();

  return !errors.value.name && !errors.value.phone && !errors.value.address;
};

const showSuccess = ref(false);

const cart = useLocalStorage("cart", []);

const totalQty = computed(() =>
  cart.value.reduce((sum, item) => sum + item.quantity, 0)
);

const totalSum = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const send = async () => {
  if (!validateForm()) return;

  const products = cart.value.map((item) => ({
    product_id: item.id,
    count: item.quantity,
  }));

  try {
    await $axios.post("/carts", { ...formState.value, products });
    cart.value = [];
    showSuccess.value = true;
  } catch (e) {
    console.error("Ошибка при отправке заявки:", e);
  }
};
</script>
