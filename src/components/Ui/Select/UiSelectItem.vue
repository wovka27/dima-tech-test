<script setup lang="ts">
  import { inject, computed } from 'vue';

  interface SelectItemProps {
    value: string;
  }

  type InjectType = {
    multiple: boolean;
    value: string | string[];
    onSelect: (val: string) => void;
  }

  const props = defineProps<SelectItemProps>();

  const ctx = inject<InjectType>('select-context');

  if (!ctx) throw new Error('SelectItem must be used inside <ui-select>');

  const isSelected = computed(() => {
    if (ctx.multiple) return Array.isArray(ctx.value) && ctx.value.map(String).includes(String(props.value));
    return String(ctx.value) === String(props.value);
  });

  const handleSelect = () => ctx.onSelect(String(props.value));
</script>

<template>
  <div
    role="option"
    :aria-selected="isSelected"
    class="select__option"
    :class="{ selected: isSelected }"
    tabindex="0"
    @click.prevent="handleSelect"
    @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <slot />
  </div>
</template>
