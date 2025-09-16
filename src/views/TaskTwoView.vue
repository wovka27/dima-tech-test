<script setup lang="ts">
import { reactive } from 'vue';
import PieChart from '@/components/PieChart.vue';
import SectorList from '@/components/Sector/SectorList.vue';
import type { Sector } from '@/types/sector.ts';

const sectors = reactive<Sector[]>([
  { id: crypto.randomUUID(), name: 'Сектор-1', value: '25', color: '#36BFBF' },
  { id: crypto.randomUUID(), name: 'Сектор-2', value: '25', color: '#FFD166' },
  { id: crypto.randomUUID(), name: 'Сектор-3', value: '25', color: '#FF6384' },
]);
</script>

<template>
  <div class="container">
    <h2 class="chart-h2">Круговая диаграмма</h2>
    <hr />

    <div class="section-diagram">
      <SectorList v-model="sectors" />
      <PieChart :data="sectors" />
    </div>
  </div>
</template>

<style lang="scss">
.chart-h2 {
  margin-left: 10px;
  margin-bottom: 30px;
  margin-top: 30px;
  font-size: 32px;
  font-weight: 600;
  line-height: 100%;
}
.section-diagram {
  padding: fluid(40, 0);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(fluid(400, 300), 1fr));
  gap: fluid(89, 30);
}
</style>
