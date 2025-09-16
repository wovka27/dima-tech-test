<script setup lang="ts">
interface InputProps {
  label?: string;
  error?: string;
}

defineProps<InputProps>();
</script>

<template>
  <div class="ui-field-container-wrap" @click="$emit('onClick')">
    <label class="ui-field-container" v-bind="$attrs">
      <span class="ui-field-container__label" v-if="label">{{label}}</span>
      <slot />
    </label>
    <span class="ui-field-container__error" v-if="error"></span>
  </div>
</template>

<style lang="scss">
.ui-field-container-wrap {
  display: flex;
  flex-direction: column;
  row-gap: 3px;
}
.ui-field-container {
  padding: 10px 20px;
  background-color: var(--color-light);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(219, 223, 233, 1);
  border-radius: 10px;
  transition-duration: var(--transition-duration);
  transition-property: border-color;

  input {
    border: none;
    outline: none;
  }

  &:has(*:focus),
  &:focus-visible {
    border-color: rgba(27, 132, 255, 1);
  }

  @include hover {
    border-color: rgba(27, 132, 255, 1);
  }

  &__label {
    color: rgba(153, 161, 183, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  }
}
</style>
