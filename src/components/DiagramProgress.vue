<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  type Shape = 'circle' | 'dashboard';
  type Status = 'in-progress' | 'success' | 'warning' | 'error';

  interface Props {
    value: number;
    size?: number | string;
    strokeWidth?: number;
    shape?: Shape;
    status?: Status;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    size: 120,
    strokeWidth: 10,
    shape: 'circle',
  });

  const animatedValue = ref(props.value);

  const radius = computed(() => (props.size - props.strokeWidth) / 2);
  const fullCircumference = computed(() => 2 * Math.PI * radius.value);

  const arcRatio = computed(() => (props.shape === 'dashboard' ? 0.75 : 1));
  const arcLength = computed(() => fullCircumference.value * arcRatio.value);

  const rotation = computed(() => (props.shape === 'dashboard' ? -225 : -90));

  const percent = computed(() => Math.min(1, Math.max(0, animatedValue.value / 100)));

  const progressLength = computed(() => arcLength.value * percent.value);

  const trackDashArray = computed(() => `${arcLength.value} ${Math.max(0, fullCircumference.value - arcLength.value)}`);

  const progressDashArray = computed(
    () => `${progressLength.value} ${Math.max(0, fullCircumference.value - progressLength.value)}`
  );

  const progressOpacity = computed(() => (percent.value === 0 ? 0 : 1));

  const colors: Record<Status, string> = {
    'in-progress': '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const strokeColor = computed(() => {
    if (props.status) {
      const included = ["error", "in-progress", "success", "warning"].includes(props.status)

      if (included) return colors[props.status];
    }

    if (percent.value * 100 <= 15) return colors.error
    if (percent.value * 100 < 50) return colors.warning
    if (percent.value * 100 < 90) return colors['in-progress']

    return colors.success
  });

  watch(
    () => props.value,
    (val) => {
      const start = animatedValue.value;
      const end = Math.min(100, Math.max(0, val));
      const duration = 500;
      const startTime = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        animatedValue.value = start + (end - start) * progress;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },
    { immediate: true }
  );
</script>

<template>
  <svg class="DiagramProgress" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <!-- фон -->
    <circle
      :cx="+size / 2"
      :cy="+size / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      fill="none"
      stroke="#f1f5f9"
      stroke-linecap="round"
      :stroke-dasharray="trackDashArray"
      stroke-dashoffset="0"
      :transform="`rotate(${rotation} ${+size / 2} ${+size / 2})`"
    />

    <circle
      :cx="+size / 2"
      :cy="+size / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      fill="none"
      :stroke="strokeColor"
      stroke-linecap="round"
      :stroke-dasharray="progressDashArray"
      :stroke-dashoffset="0"
      :transform="`rotate(${rotation} ${+size / 2} ${+size / 2})`"
      :style="{ opacity: progressOpacity }"
    />

    <text
      class="DiagramProgress__text"
      v-if="status === 'in-progress' || !status"
      :x="+size / 2"
      :y="+size / 2 + 5"
      text-anchor="middle"
      font-size="18"
      fill="#374151"
    >
      {{ Math.round(animatedValue) }}%
    </text>

    <text
      class="DiagramProgress__text"
      v-else-if="status === 'success'"
      :x="+size / 2"
      :y="+size / 2 + 6"
      text-anchor="middle"
      font-size="20"
      fill="#22c55e"
    >
      ✔
    </text>

    <text
      class="DiagramProgress__text"
      v-else-if="status === 'warning'"
      :x="+size / 2"
      :y="+size / 2 + 6"
      text-anchor="middle"
      font-size="20"
      fill="#f59e0b"
    >
      !
    </text>

    <text
      class="DiagramProgress__text"
      v-else-if="status === 'error'"
      :x="+size / 2"
      :y="+size / 2 + 6"
      text-anchor="middle"
      font-size="20"
      fill="#ef4444"
    >
      ✕
    </text>
  </svg>
</template>
