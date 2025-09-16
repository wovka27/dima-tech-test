<script setup lang="ts">
  defineProps<{ value: string; width?: number; height?: number }>();
</script>

<template>
  <div :style="{ '--w': width + 'px', '--h': height + 'px', '--bgc': value }" class="color-preview"></div>
</template>

<style lang="scss">
  .color-preview {
    --bgc: null;
    --w: 24px;
    --h: 24px;
    width: var(--w);
    height: var(--h);
    border-radius: 50%;
    background-color: var(--bgc, #fff);
  }
</style>
