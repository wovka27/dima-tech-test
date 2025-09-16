<script setup lang="ts">
</script>

<template>
  <button class="ui-button" v-bind="$attrs">
    <slot />
  </button>
</template>

<style lang="scss">
.ui-button {
  width: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-color: transparent;
  border-radius: 10px;
  color: var(--color-light);
  background-color: var(--color-blue);
  padding: 18px 36px;

  @include hover {
    background-color: var(--color-blue-2);
  }
}
</style>
