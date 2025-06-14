<template>
  <div>
    <canvas ref="chartRef" />
  </div>
</template>

<script setup>
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import { onMounted, ref, watch } from "vue";

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: Object,
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (chartInstance) chartInstance.destroy();
  chartInstance = new ChartJS(chartRef.value, {
    type: "bar",
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Кол-во заказов" },
        },
        x: {
          title: { display: true, text: "Даты" },
        },
      },
    },
  });
};

onMounted(() => {
  if (props.chartData) initChart();
});

watch(
  () => props.chartData,
  () => {
    if (props.chartData) initChart();
  }
);
</script>
