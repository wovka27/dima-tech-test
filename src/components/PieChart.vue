<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import type { Sector } from '@/types/sector.ts';

Chart.register(ArcElement, Tooltip, Legend, PieController);

interface PieChartProps {
  data: Sector[]
}

const props = withDefaults(defineProps<PieChartProps>(), {
  data: () => []
})

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const renderChart = () => {
  if (!chartCanvas.value) return;

  if (chart) chart.destroy();

  console.log(chartCanvas.value);

  chart = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels: props.data.map((s) => s.name),
      datasets: [
        {
          data: props.data.map((s) => s.value),
          backgroundColor: props.data.map((s) => s.color),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 15,
              family: 'Inter, sans-serif',
              lineHeight: 24
            },
            padding: 40,
            boxWidth: 14,
            boxHeight: 14,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
      },
    },
  });
};

watch(
  () => props.data.map((s) => ({ name: s.name, value: s.value, color: s.color })),
  () => renderChart(),
  { deep: true, immediate: true },
);

onMounted(renderChart);
</script>

<template>
  <div class="pie-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<style lang="scss">
.pie-chart {
  position: relative;
}
</style>
