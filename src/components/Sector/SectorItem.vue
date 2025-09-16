<script setup lang="ts">
  import { computed } from 'vue';
  import type { Sector } from '@/types/sector.ts';

  interface SectorItemProps {
    data: Sector;
  }

  const props = defineProps<SectorItemProps>();

  defineEmits<{
    (event: 'edit'): void;
    (event: 'remove'): void;
  }>();

  const colorStyle = computed(() => `background-color: ${props.data.color ?? '#fff'};`);
</script>

<template>
  <div class="sector-item">
    <div>{{ data.name }}</div>
    <div class="sector-item__separator"></div>
    <div>{{ data.value }}%</div>
    <div class="sector-item__separator"></div>
    <div :style="colorStyle" class="sector-item__color"></div>
    <div class="sector-item__actions">
      <button class="sector-item__action" @click="$emit('edit')">
        <svg class viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24.000000" height="24.000000" fill="none">
          <rect id="Line / Edit" width="24.000000" height="24.000000" x="0.000000" y="0.000000" />
          <path
            id="Vector"
            d="M3.34134 19.2201C3.24381 20.1057 4.05713 20.8251 4.9425 20.6363L8.77269 19.82C9.27079 19.7138 9.72729 19.4689 10.0877 19.1146L17.8504 11.4821L19.7279 9.63604C20.7648 8.61651 20.7648 6.96352 19.7279 5.94399L17.8504 4.09796C16.8135 3.07843 15.1323 3.07843 14.0953 4.09796L12.2178 5.94399L4.56463 13.4688C4.1365 13.8897 3.86755 14.4419 3.80237 15.0338L3.34134 19.2201ZM12.2178 5.94399L17.8504 11.4821M15.0341 20.4932L20.6667 20.4932"
            fill-rule="nonzero"
            stroke="rgb(153,161,183)"
            stroke-linecap="round"
            stroke-width="1.5"
          />
        </svg>
      </button>
      <button class="sector-item__action" @click="$emit('remove')">
        <svg
          class
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width="24.000000"
          height="24.000000"
          fill="none"
          customFrame="#000000"
        >
          <rect id="Line / Trash" width="24.000000" height="24.000000" x="0.000000" y="0.000000" />
          <path
            id="Vector"
            d="M18 7.3L18 8C18 8 18 10.0552 18 11.0823L18 17.5C18 19.7091 16.2091 21.5 14 21.5L10 21.5C7.79086 21.5 6 19.7091 6 17.5L6 11.0823C6 10.0552 6 8 6 8L6 7.3M8 6.5L8.54415 3.86754C8.81638 3.05086 9.58066 2.5 10.4415 2.5L13.5585 2.5C14.4193 2.5 15.1836 3.05086 15.4558 3.86754L16 6.5M3.75 6.5L20.25 6.5"
            stroke="rgb(153,161,183)"
            stroke-linecap="round"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
  .sector-item {
    border-radius: 10px;
    display: grid;
    align-items: center;
    grid-template-columns: fluid(100, 70) max-content 30px max-content 1fr max-content;
    background-color: rgba(219, 223, 233, 0.2);
    transition-duration: var(--transition-duration);
    transition-property: background-color;
    padding: 18px 20px;

    @include hover {
      background-color: rgba(219, 223, 233, 0.4);
    }
  }
  .sector-item__actions {
    margin-left: 25px;
    display: flex;
    justify-content: flex-end;
    gap: 20px;
  }

  .sector-item__action {
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    padding: 0;

    @include hover {
      color: var(--color-blue);
    }
  }
  .sector-item__color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .sector-item__separator {
    margin-inline: fluid(25, 10);
    width: 0;
    height: 16px;
    border: 2px solid rgba(219, 223, 233, 1);
    border-radius: 2px;
  }
</style>
