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
        <canvas
          ref="canvasRef"
          width="1320"
          height="500"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { onMounted, ref } from "vue";

definePageMeta({
  middleware: "admin-auth-client",
});

// Регистрируем компоненты Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const canvasRef = ref(null);
const chartInstance = ref(null);
const { $axios } = useNuxtApp();

onMounted(async () => {
  const { data } = await $axios.get("/search");
  const items = Array.isArray(data.result) ? data.result : [];

  const labels = items.length ? items.map((i) => i.text) : ["Нет данных"];
  const dataValues = items.length ? items.map((i) => i.count) : [0];

  if (canvasRef.value) {
    // Если график уже есть — уничтожаем его
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    const ctx = canvasRef.value.getContext("2d");

    chartInstance.value = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Топ запросов",
            data: dataValues,
            backgroundColor: "#8B0000",
            borderColor: "#8B0000",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
</script>

<style scoped>
.chart-container {
  min-width: 1000px;
  max-width: 100%;
  height: 500px;
  overflow-x: auto;
  position: relative;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
