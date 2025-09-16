<script setup lang="ts">
  import { ref } from 'vue';
  import DiagramProgress from '@/components/DiagramProgress.vue';

  type Shape = 'circle' | 'dashboard';
  type Status = 'in-progress' | 'success' | 'warning' | 'error' | undefined;

  interface Demo {
    shape: Shape;
    value: number;
    status: Status;
  }

  const demos = ref<Demo[]>([
    { shape: 'circle', value: 0, status: undefined },
    { shape: 'dashboard', value: 0, status: undefined },
  ]);

  const startLoading = (demo: Demo, finalStatus: Status) => {
    demo.value = 0;
    demo.status = undefined;

    const stopAt = finalStatus === 'success' ? 100 : Math.floor(Math.random() * 60) + 30;

    const interval = setInterval(() => {
      if (demo.value < stopAt) {
        demo.value += Math.floor(Math.random() * 6) + 2; // шаг 2–7
        if (demo.value > stopAt) demo.value = stopAt;
      } else {
        clearInterval(interval);
        demo.status = finalStatus;
      }
    }, 200);
  }
</script>

<template>
  <div class="section-diagram">
    <div
      v-for="(demo, idx) in demos"
      :key="idx"
      style="display: flex; flex-direction: column; align-items: center; gap: 12px"
    >
      <DiagramProgress :value="demo.value" :status="demo.status" :shape="demo.shape" size="120" />

      <div style="display: flex; flex-direction: column; gap: 6px">
        <button @click="startLoading(demo, undefined)">{{ demo.shape }} → loading (без статуса, обрыв)</button>
        <button @click="startLoading(demo, 'success')">{{ demo.shape }} → success (идёт до 100%)</button>
        <button @click="startLoading(demo, 'warning')">{{ demo.shape }} → warning (обрыв)</button>
        <button @click="startLoading(demo, 'error')">{{ demo.shape }} → error (обрыв)</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .section-diagram {
    padding: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 89px;
  }
</style>
