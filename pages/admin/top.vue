<template>
  <div class="container">
    <main>
      <div class="flex gap-4 justify-end mb-8">
        <nuxt-link
          class="bg-white text-primary px-8 py-2 rounded-4xl text-2xl hover:bg-primary hover:text-white transition-all"
          to="/admin"
        >
          Склад
        </nuxt-link>
      </div>

      <div
        class="list-container space-y-4 bg-[#842222] p-8 rounded-2xl max-h-[50dvh] overflow-y-auto"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="bg-white shadow-md rounded-xl p-4 flex justify-between items-center"
        >
          <span class="text-lg font-medium text-gray-700">{{ item.text }}</span>
          <span class="text-xl font-bold text-primary">{{ item.count }}</span>
        </div>
        <div
          v-if="!items.length"
          class="text-gray-500"
        >
          Нет данных
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

definePageMeta({
  middleware: "admin-auth-client",
});

const { $axios } = useNuxtApp();
const items = ref([]);

onMounted(async () => {
  const { data } = await $axios.get("/search");
  items.value = Array.isArray(data.result) ? data.result : [];
});
</script>

<style scoped>
.list-container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
