<script setup lang="ts">
  import UiFieldContainer from '@/components/Ui/UiFieldContainer.vue';

  interface InputProps {
    label?: string;
    error?: string;
  }

  defineProps<InputProps>();
  const model = defineModel<string | number>();
</script>

<template>
  <UiFieldContainer :label="label" :error="error">
    <input type="text" v-bind="$attrs" v-model="model" />
  </UiFieldContainer>
</template>
