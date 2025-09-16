<script setup lang="ts">
  import { ref, watch, onMounted, nextTick, computed } from 'vue';

  type Format = (typeof formats)[number];

  const formats = ['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla'] as const;

  const hsvToRgb = (h: number, s: number, v: number) => {
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    ).toUpperCase();

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s, v };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }
    return { h, s, l };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h = h / 360;
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    } else if (hex.length === 4) {
      const r = hex[0] + hex[0];
      const g = hex[1] + hex[1];
      const b = hex[2] + hex[2];
      const a = hex[3] + hex[3];
      const bigint = parseInt(r + g + b, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        a: parseInt(a, 16) / 255,
      } as any;
    }
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return { r, g, b, a } as any;
    }
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const formatColor = (h: number, s: number, v: number, a: number, format: Format) => {
    const { r, g, b } = hsvToRgb(h, s, v);
    switch (format) {
      case 'hex':
        return rgbToHex(r, g, b);
      case 'hexa': {
        const aHex = Math.round(a * 255)
          .toString(16)
          .padStart(2, '0')
          .toUpperCase();
        return rgbToHex(r, g, b) + aHex;
      }
      case 'rgb':
        return `rgb(${r}, ${g}, ${b})`;
      case 'rgba':
        return `rgba(${r}, ${g}, ${b}, ${Number(a).toFixed(3)})`;
      case 'hsl': {
        const { h: hh, s: ss, l } = rgbToHsl(r, g, b);
        return `hsl(${Math.round(hh)}, ${Math.round(ss * 100)}%, ${Math.round(l * 100)}%)`;
      }
      case 'hsla': {
        const { h: hh, s: ss, l } = rgbToHsl(r, g, b);
        return `hsla(${Math.round(hh)}, ${Math.round(ss * 100)}%, ${Math.round(l * 100)}%, ${Number(a).toFixed(3)})`;
      }
    }
  };

  const parseColorString = (str: string) => {
    if (!str) return null;
    const s = str.trim();
    if (/^#([0-9a-f]{3,8})$/i.test(s)) {
      const noHash = s.replace('#', '');
      if (noHash.length === 3) {
        const { r, g, b } = hexToRgb('#' + noHash);
        return { r, g, b, a: 1 };
      }
      if (noHash.length === 4) {
        const obj: any = hexToRgb('#' + noHash);
        return { r: obj.r, g: obj.g, b: obj.b, a: obj.a ?? 1 };
      }
      if (noHash.length === 6) {
        const { r, g, b } = hexToRgb('#' + noHash);
        return { r, g, b, a: 1 };
      }
      if (noHash.length === 8) {
        const obj: any = hexToRgb('#' + noHash);
        return { r: obj.r, g: obj.g, b: obj.b, a: obj.a ?? 1 };
      }
    }

    let m = s.match(/^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (m) {
      const r = Math.min(255, +m[1]);
      const g = Math.min(255, +m[2]);
      const b = Math.min(255, +m[3]);
      const a = m[4] !== undefined ? Math.max(0, Math.min(1, +m[4])) : 1;
      return { r, g, b, a };
    }

    m = s.match(/^hsla?\(\s*([\d.]+)(deg|rad|grad|turn)?\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (m) {
      let h = +m[1];
      const unit = m[2];
      if (unit === 'rad') h = (h * 180) / Math.PI;
      else if (unit === 'grad') h = h * 0.9;
      else if (unit === 'turn') h = h * 360;
      h = ((h % 360) + 360) % 360;
      const sPerc = +m[3] / 100;
      const lPerc = +m[4] / 100;
      const a = m[5] !== undefined ? Math.max(0, Math.min(1, +m[5])) : 1;
      const { r, g, b } = hslToRgb(h, sPerc, lPerc);
      return { r, g, b, a };
    }

    return null;
  };

  const model = defineModel<string>();

  const hue = ref(250);
  const saturation = ref(1);
  const value = ref(1);
  const alpha = ref(1);
  const hex = ref('#4F46E5');
  const textValue = ref('');
  const format = ref<Format>('hex');

  const svCanvas = ref<HTMLCanvasElement | null>(null);
  const ctx = ref<CanvasRenderingContext2D | null>(null);

  const skipEmit = ref(false);
  const isSettingText = ref(false);
  const rawValue = ref('');

  const prefix = computed(() => {
    switch (format.value) {
      case 'hex':
      case 'hexa':
        return '#';
      case 'rgb':
        return 'rgb(';
      case 'rgba':
        return 'rgba(';
      case 'hsl':
        return 'hsl(';
      case 'hsla':
        return 'hsla(';
    }
  });

  const isShowAlpha = computed<boolean>(() => ['hexa', 'rgba', 'hsla'].includes(format.value));

  const formatValue = (raw: string, f: Format): string => {
    raw = typeof raw === 'string' ? raw.trim() : String(raw ?? '');

    switch (f) {
      case 'hex':
      case 'hexa':
        return raw ? `#${raw.toUpperCase()}` : '';
      case 'rgb':
        return raw ? `rgb(${raw})` : '';
      case 'rgba':
        return raw ? `rgba(${raw})` : '';
      case 'hsl':
        return raw ? `hsl(${raw})` : '';
      case 'hsla':
        return raw ? `hsla(${raw})` : '';
      default:
        return raw;
    }
  }


  const parseValue = (full: string, f: Format): string => {
    if (!full) return '';

    switch (f) {
      case 'hex':
      case 'hexa':
        return full.replace(/^#/, '');
      case 'rgb':
      case 'rgba':
      case 'hsl':
      case 'hsla':
        return full.replace(/^[a-z]+\(/i, '').replace(/\)$/, '');
      default:
        return full;
    }
  }

  const updateColorLocal = () => {
    const { r, g, b } = hsvToRgb(hue.value, saturation.value, value.value);
    hex.value = rgbToHex(r, g, b);
  };

  const drawSV = () => {
    if (!ctx.value || !svCanvas.value) return;
    const w = svCanvas.value.width;
    const h = svCanvas.value.height;

    const { r, g, b } = hsvToRgb(hue.value, 1, 1);
    ctx.value.fillStyle = `rgb(${r},${g},${b})`;
    ctx.value.fillRect(0, 0, w, h);

    const whiteGrad = ctx.value.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.value.fillStyle = whiteGrad;
    ctx.value.fillRect(0, 0, w, h);

    const blackGrad = ctx.value.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.value.fillStyle = blackGrad;
    ctx.value.fillRect(0, 0, w, h);

    const x = saturation.value * w;
    const y = (1 - value.value) * h;
    ctx.value.strokeStyle = '#fff';
    ctx.value.lineWidth = 1;
    ctx.value.beginPath();
    ctx.value.arc(x, y, 6, 0, Math.PI * 2);
    ctx.value.stroke();
  };

  const handleSV = (e: MouseEvent) => {
    if (!svCanvas.value) return;
    const rect = svCanvas.value.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    saturation.value = x / rect.width;
    value.value = 1 - y / rect.height;
    updateColorLocal();
    drawSV();
  };

  const startSV = (e: MouseEvent) => {
    handleSV(e);
    window.addEventListener('mousemove', handleSV);
    window.addEventListener('mouseup', stopSV);
  };

  const stopSV = () => {
    window.removeEventListener('mousemove', handleSV);
    window.removeEventListener('mouseup', stopSV);
  };

  const handleRawInput = () => {
    const full = prefix.value + rawValue.value + (prefix.value.includes('(') ? ')' : '');
    textValue.value = full;
  };

  const toggleFormat = () => {
    const idx = formats.indexOf(format.value);
    format.value = formats[(idx + 1) % formats.length];
  };

  watch(hue, drawSV);

  watch([hue, saturation, value], () => {
    updateColorLocal();
  });

  watch(
    [hue, saturation, value, alpha, format],
    async () => {
      if (skipEmit.value) {
        skipEmit.value = false;
        return;
      }
      const out = formatColor(hue.value, saturation.value, value.value, alpha.value, format.value);
      isSettingText.value = true;
      textValue.value = out;
      model.value = out;
      await nextTick();
      isSettingText.value = false;
    },
    { deep: true }
  );

  watch(
    model,
    async (val) => {
      if (!val) return;
      const parsed = parseColorString(val);

      if (!parsed) return;

      skipEmit.value = true;
      const { r, g, b, a = 1 } = parsed;
      const hsv = rgbToHsv(r, g, b);
      hue.value = hsv.h;
      saturation.value = hsv.s;
      value.value = hsv.v;
      alpha.value = typeof a === 'number' ? a : 1;
      hex.value = rgbToHex(r, g, b);

      isSettingText.value = true;
      textValue.value = formatColor(hue.value, saturation.value, value.value, alpha.value, format.value);
      await nextTick();
      isSettingText.value = false;
    },
    { immediate: true }
  );

  watch(textValue, (val) => {
    if (isSettingText.value) return;
    const parsed = parseColorString(val);

    if (!parsed) return;

    skipEmit.value = true;
    const { r, g, b, a = 1 } = parsed;
    const hsv = rgbToHsv(r, g, b);
    hue.value = hsv.h;
    saturation.value = hsv.s;
    value.value = hsv.v;
    alpha.value = typeof a === 'number' ? a : 1;
    hex.value = rgbToHex(r, g, b);

    const normalized = formatColor(hue.value, saturation.value, value.value, alpha.value, format.value);

    isSettingText.value = true;
    textValue.value = normalized;
    model.value = normalized;

    nextTick(() => {
      isSettingText.value = false;
    });
  });


  watch([rawValue], (val) => {
    model.value = formatValue(val, format.value);
  });


  watch([model, format], ([val, f]) => {
    rawValue.value = parseValue(val, f);
  });

  onMounted(() => {
    if (svCanvas.value) {
      ctx.value = svCanvas.value.getContext('2d');
      drawSV();
    }
  });
</script>

<template>
  <div class="color-picker">
    <canvas ref="svCanvas" height="150" class="sv-panel" @mousedown="startSV"></canvas>

    <div class="color-picker__sliders">
      <div class="color-picker__circle-preview" :style="{ '--color-preview': model }"></div>
      <input type="range" min="0" max="360" v-model="hue" class="hue-slider" />

      <input
        v-if="isShowAlpha"
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="alpha"
        class="alpha-slider"
        :style="{ '--c': hex }"
      />
    </div>

    <div class="hex-input">
      <div style="display: flex; flex-direction: column; gap: 8px; justify-content: center; width: 100%">
        <div class="color-input">
          <span class="prefix">{{ prefix }}</span>
          <input v-model="rawValue" @input="handleRawInput" />
        </div>
        <div class="format-label">{{ format.toUpperCase() }}</div>
      </div>
      <svg
        style="cursor: pointer"
        @click="toggleFormat"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="20.000000"
        height="20.000000"
        fill="none"
      >
        <rect
          id="Icon"
          width="20.000000"
          height="20.000000"
          x="0.000000"
          y="0.000000"
          fill="rgb(255,255,255)"
          fill-opacity="0"
        />
        <path
          id="Vector"
          d="M6.07358 11.2539C6.22954 11.098 6.44103 11.0104 6.66156 11.0104C6.88209 11.0104 7.09358 11.098 7.24954 11.2539L9.9882 13.9926L12.7269 11.2539C12.8036 11.1745 12.8953 11.1111 12.9968 11.0675C13.0983 11.0239 13.2074 11.001 13.3178 11C13.4283 10.9991 13.5378 11.0201 13.64 11.0619C13.7422 11.1037 13.835 11.1655 13.9131 11.2436C13.9912 11.3217 14.053 11.4145 14.0948 11.5167C14.1366 11.6189 14.1576 11.7285 14.1567 11.8389C14.1557 11.9493 14.1328 12.0584 14.0892 12.1599C14.0456 12.2614 13.9823 12.3531 13.9028 12.4299L10.5762 15.7565C10.4202 15.9124 10.2087 16 9.9882 16C9.76767 16 9.55618 15.9124 9.40022 15.7565L6.07358 12.4299C5.91767 12.2739 5.83008 12.0624 5.83008 11.8419C5.83008 11.6214 5.91767 11.4099 6.07358 11.2539Z"
          fill="rgb(156,163,175)"
          fill-rule="evenodd"
        />
        <path
          id="Vector"
          d="M13.9132 8.74586C13.7573 8.90177 13.5458 8.98936 13.3252 8.98936C13.1047 8.98936 12.8932 8.90177 12.7373 8.74586L9.9986 6.0072L7.25994 8.74586C7.18322 8.82529 7.09145 8.88865 6.98999 8.93224C6.88852 8.97582 6.77939 8.99876 6.66896 8.99972C6.55854 9.00068 6.44903 8.97964 6.34682 8.93782C6.24461 8.89601 6.15175 8.83426 6.07367 8.75617C5.99558 8.67808 5.93383 8.58523 5.89201 8.48302C5.85019 8.38081 5.82915 8.2713 5.83011 8.16087C5.83107 8.05044 5.85401 7.94131 5.8976 7.83985C5.94118 7.73838 6.00454 7.64661 6.08397 7.56989L9.41061 4.24325C9.56657 4.08734 9.77807 3.99976 9.9986 3.99976C10.2191 3.99976 10.4306 4.08734 10.5866 4.24325L13.9132 7.56989C14.0691 7.72585 14.1567 7.93735 14.1567 8.15788C14.1567 8.3784 14.0691 8.5899 13.9132 8.74586Z"
          fill="rgb(156,163,175)"
          fill-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss">
  .color-picker {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 280px;
    font-family: sans-serif;
  }
  .color-picker__circle-preview {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-preview);
    grid-row: span 2;
  }
  .color-picker__sliders {
    align-items: center;
    display: grid;
    grid-template-columns: 32px 1fr;
    grid-gap: 16px;
  }
  .sv-panel {
    border-radius: 8px;
    cursor: crosshair;
    width: 100%;
    max-height: 150px;
  }
  .hue-slider {
    -webkit-appearance: none;
    height: 8px;
    border-radius: 100px;
    background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
    outline: none;
  }
  .alpha-slider {
    -webkit-appearance: none;
    height: 8px;
    border-radius: 100px;
    background: linear-gradient(to right, transparent, var(--c));
    outline: none;
  }
  .hex-input {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .hex-input input {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  /* Chrome, Safari, Edge */
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 1);
    box-shadow:
      0 4px 6px 0 rgba(31, 41, 55, 0.1),
      0 2px 4px 0 rgba(31, 41, 55, 0.06);
    background: transparent;
    cursor: pointer;
  }
  /* Firefox */
  input[type='range']::-moz-range-thumb {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 1);
    box-shadow:
      0 4px 6px 0 rgba(31, 41, 55, 0.1),
      0 2px 4px 0 rgba(31, 41, 55, 0.06);
    background: transparent;
    cursor: pointer;
  }
  /* IE, старый Edge */
  input[type='range']::-ms-thumb {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 1);
    box-shadow:
      0 4px 6px 0 rgba(31, 41, 55, 0.1),
      0 2px 4px 0 rgba(31, 41, 55, 0.06);
    background: transparent;
    cursor: pointer;
  }

  .color-input {
    width: 100%;
    padding: 4px 6px;
    border: 1px solid #ccc;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;

    .prefix {
      color: #99a1b7;
      font-size: 14px;
      pointer-events: none;
      font-weight: 400;
      line-height: 20px;
    }

    input {
      font-weight: 400;
      line-height: 20px;
      border: none;
      outline: none;
      background-color: transparent;
      width: 100%;
      font-size: 14px;
    }
  }

  .format-label {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-transform: uppercase;
    color: rgba(153, 161, 183, 1);
  }
</style>
