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

      <div class="chart-container">
        <Chart :chart-data="chartData" />
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "admin-auth",
});

import { ref } from "vue";
import Chart from "~/components/admin/Chart.vue";

const chartData = ref();

const { $axios } = useNuxtApp();
const response = await $axios.get("/search");
const items = Array.isArray(response.data) ? response.data : [];

if (items.length === 0) {
  chartData.value = {
    labels: ["Нет данных"],
    datasets: [
      {
        label: "Топ запросов",
        data: [0],
        backgroundColor: "#ccc",
        borderColor: "#ccc",
      },
    ],
  };
} else {
  const labels = items.map((item) => item.text);
  const counts = items.map((item) => item.count);

  chartData.value = {
    labels,
    datasets: [
      {
        label: "Топ запросов",
        data: counts,
        backgroundColor: "#8B0000",
        borderColor: "#8B0000",
        borderWidth: 1,
      },
    ],
  };
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>
