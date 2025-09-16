<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted, provide, useSlots, nextTick } from 'vue';
  import UiFieldContainer from '@/components/Ui/UiFieldContainer.vue';

  type Value = string | string[];

  interface SelectContextValue {
    multiple: boolean;
    value: Value;
    onSelect: (val: string) => void;
  }

  const props = defineProps<{
    id?: string;
    defaultValue?: string | string[];
    multiple?: boolean;
    placeholder?: string;
    dropdownHeight?: number;
    name?: string;
    error?: string;
    label?: string;
    onChange?: (val: string | string[]) => void;
  }>();

  const emit = defineEmits<{
    (e: 'native-change', event: Event): void;
  }>();

  const model = defineModel<string | string[]>();

  const {
    id,
    defaultValue,
    multiple = false,
    placeholder = 'Select...',
    dropdownHeight = 300,
    name,
    error,
    onChange,
  } = props;

  const isOpen = ref(false);
  const dropUp = ref(false);

  const refRoot = ref<HTMLElement | null>(null);

  const isControlled = computed(() => model.value !== undefined);

  const internalValue = ref<Value>(() => {
    if (model.value !== undefined) return model.value;
    if (defaultValue !== undefined) return defaultValue;
    return multiple ? [] : '';
  }) as any;

  const selectedValue = computed<Value>(() => (isControlled.value ? (model.value as Value) : internalValue.value));

  const nativeSelectValue = computed(() => {
    if (multiple) {
      return Array.isArray(selectedValue.value) ? selectedValue.value.map(String) : [];
    }
    return typeof selectedValue.value === 'string' ? selectedValue.value : String(selectedValue.value ?? '');
  });

  const handleSelect = (val: string) => {
    const valStr = String(val);
    if (multiple) {
      const arr = Array.isArray(selectedValue.value) ? selectedValue.value.map(String) : [];
      const exists = arr.includes(valStr);
      const newValue = exists ? arr.filter((v) => v !== valStr) : [...arr, valStr];
      if (!isControlled.value) internalValue.value = newValue;
      onChange?.(newValue);
      model.value = newValue;
    } else {
      if (!isControlled.value) internalValue.value = valStr;
      onChange?.(valStr);
      model.value = valStr;
      isOpen.value = false;
    }
  };

  const updateDropdownPosition = () => {
    if (refRoot.value) {
      const rect = refRoot.value.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      dropUp.value = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    }
  };

  const openDropDown = () => {
    isOpen.value = !isOpen.value;
  };

  const slots = useSlots();

  const renderLabel = computed(() => {
    const children = slots.default?.() ?? [];

    if (multiple && Array.isArray(selectedValue.value) && selectedValue.value.length) {
      return selectedValue.value
        .map((val) => {
          const opt = children.find((child: any) => String(child.props?.value) === String(val));
          return opt ? opt.children : val;
        })
        .join(', ');
    }

    if (!multiple && typeof selectedValue.value === 'string' && selectedValue.value) {
      const opt = children.find((child: any) => String(child.props?.value) === String(selectedValue.value));
      return opt ? opt.children : selectedValue.value;
    }

    return placeholder;
  });

  onMounted(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refRoot.value && !refRoot.value.contains(e.target as Node)) {
        isOpen.value = false;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    onUnmounted(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });
  });

  watch(isOpen, (open) => {
    if (!open) return;

    nextTick(() => updateDropdownPosition());

    const handleScroll = () => updateDropdownPosition();
    const handleResize = () => updateDropdownPosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(() => updateDropdownPosition());
    if (refRoot.value) observer.observe(refRoot.value);

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    });
  });

  const handleNativeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    if (multiple) {
      const vals = Array.from(target.selectedOptions).map((o) => o.value);
      if (!isControlled.value) internalValue.value = vals;
      onChange?.(vals);
      model.value = vals;
    } else {
      const v = target.value;
      if (!isControlled.value) internalValue.value = v;
      onChange?.(v);
      model.value = v;
    }
    emit('native-change', e);
  };

  provide<SelectContextValue>('select-context', {
    multiple,
    value: selectedValue.value,
    onSelect: handleSelect,
  });
</script>

<template>
  <UiFieldContainer :error="error" :label="label">
    <div :id="id ? `${id}-root` : undefined" class="select" ref="refRoot">
      <div
        tabindex="0"
        role="combobox"
        :aria-expanded="isOpen"
        :aria-controls="id ? `${id}-dropdown` : 'select-dropdown'"
        class="select__control"
        :class="{ open: isOpen, 'select__control--error': error }"
        @click="openDropDown"
      >
        <slot name="select_value" :value="renderLabel">
          <span class="select__value">{{ renderLabel }}</span>
        </slot>
        <span class="select__arrow">
          <svg
            :style="`rotate: ${isOpen ? 0 : 180}deg`"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16.000000"
            height="16.000000"
            fill="none"
            customFrame="#000000"
          >
            <rect
              id="line / arrow"
              width="16.000000"
              height="16.000000"
              x="0.000000"
              y="0.000000"
              fill="rgb(255,255,255)"
              fill-opacity="0"
              transform="matrix(-4.37114e-08,1,1,4.37114e-08,0,0)"
            />
            <path
              id="Vector"
              d="M0 0L3.64645 3.64645C3.84171 3.84171 4.15829 3.84171 4.35355 3.64645L8 0"
              stroke="rgb(153,161,183)"
              stroke-linecap="round"
              stroke-width="1.29999995"
              transform="matrix(-1,-3.17865e-08,3.17865e-08,-1,12,10)"
            />
          </svg>
        </span>
      </div>
      <p v-if="error" class="select__error">{{ error }}</p>

      <select
        :id="id ? `${id}-native` : undefined"
        :name="name"
        :multiple="multiple"
        style="display: none"
        :value="nativeSelectValue"
        @change="handleNativeChange"
      >
        <slot />
      </select>

      <div
        v-if="isOpen"
        role="listbox"
        :id="id ? `${id}-dropdown` : 'select-dropdown'"
        :aria-multiselectable="multiple"
        class="select__dropdown"
        :class="{ top: dropUp, bottom: !dropUp }"
        :style="{ maxHeight: dropdownHeight + 'px' }"
      >
        <slot />
      </div>
    </div>
  </UiFieldContainer>
</template>

<style lang="scss">
  .select {
    position: relative;

    &__error {
      font-size: 12px;
      color: var(--color-red);
    }

    &__control {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-light);
      cursor: pointer;
      transition-duration: var(--transition-duration);
    }

    &__value {
      flex: 1;
      color: #333333;
    }

    &__arrow {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 8px;
    }

    &__dropdown {
      @include hide-scroll;

      position: absolute;
      z-index: 10;
      right: 0;
      left: 0;
      overflow-y: auto;
      max-height: 200px;
      background: var(--color-light);
      border-radius: var(--border-radius-8);
      box-shadow:
        0 2px 4px 0 rgba(0, 0, 0, 0.16),
        0 rem(-1) 4px 0 rgba(0, 0, 0, 0.04);
      transition-duration: var(--transition-duration);
      transition-timing-function: ease;

      &.bottom {
        top: calc(100% + 4px);
      }

      &.top {
        bottom: calc(100% + 4px);
      }
    }

    &__option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 12px;
      cursor: pointer;

      &:hover {
        background: #0000000d;
      }

      &.selected {
        background: #0000000d;
      }
    }

    &__checkbox {
      margin-right: 6px;
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
