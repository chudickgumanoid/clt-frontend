<template>
  <div class="container">
    <main>
      <div class="flex gap-4 justify-between mb-8">
        <nuxt-link
          class="bg-white text-primary px-8 py-2 rounded-4xl text-2xl hover:bg-primary hover:text-white transition-all"
          to="/admin"
        >
          Склад
        </nuxt-link>
        <nuxt-link
          class="bg-white text-primary px-8 py-2 rounded-4xl text-2xl hover:bg-primary hover:text-white transition-all"
          to="/admin/top"
        >
          Заказы
        </nuxt-link>
      </div>

      <div class="chart-container">
        <Chart :chart-data="chartData" />
      </div>
    </main>
  </div>
</template>

<script setup>
import Chart from "~/components/admin/Chart.vue";

const chartData = ref();

const { $axios } = useNuxtApp();
const { data } = await $axios.get("/statistic");
const dates = Object.keys(data.result);
const orders = Object.values(data.result);

chartData.value = {
  labels: dates,
  datasets: [
    {
      label: "Кол-во заказов",
      data: orders,
      backgroundColor: "#8B0000",
      borderColor: "#8B0000",
      borderWidth: 1,
    },
  ],
};
</script>

<style scoped></style>
