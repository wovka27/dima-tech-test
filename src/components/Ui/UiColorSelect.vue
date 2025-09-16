<script setup lang="ts">
  import { ref, computed } from 'vue';
  import ColorPreview from '@/components/ColorPreview.vue';
  import ColorPicker from '@/components/Ui/ColorPicker.vue';
  import UiFieldContainer from '@/components/Ui/UiFieldContainer.vue';

  interface IColorPickerProps {
    label?: string;
    error?: string;
  }

  const hexToRuName: Record<string, string> = {
    '#FFFFFF': 'белый',
    '#000000': 'чёрный',
    '#FF0000': 'красный',
    '#8B0000': 'тёмно-красный',
    '#FFA07A': 'светло-лососевый',
    '#DC143C': 'алый',
    '#FF6347': 'томатный',
    '#FF4500': 'оранжево-красный',
    '#FF8C00': 'тёмно-оранжевый',
    '#FFA500': 'оранжевый',
    '#FFFF00': 'жёлтый',
    '#FFD700': 'золотой',
    '#F0E68C': 'хаки-жёлтый',
    '#ADFF2F': 'желто-зелёный',
    '#00FF00': 'лаймовый',
    '#228B22': 'лесной зелёный',
    '#008000': 'зелёный',
    '#006400': 'тёмно-зелёный',
    '#32CD32': 'лайм-зелёный',
    '#00FFFF': 'циан',
    '#40E0D0': 'бирюзовый',
    '#008080': 'тёмно-бирюзовый',
    '#0000FF': 'синий',
    '#00008B': 'тёмно-синий',
    '#1E90FF': 'ярко-голубой',
    '#4169E1': 'королевский синий',
    '#87CEEB': 'небесно-голубой',
    '#4B0082': 'индиго',
    '#8A2BE2': 'сине-фиолетовый',
    '#9932CC': 'тёмно-пурпурный',
    '#BA55D3': 'сиренево-пурпурный',
    '#D8BFD8': 'лиловый',
    '#EE82EE': 'фиолетово-розовый',
    '#FFC0CB': 'розовый',
    '#FF69B4': 'неоново-розовый',
    '#A52A2A': 'коричневый',
    '#8B4513': 'тёмно-коричневый',
    '#D2691E': 'шоколадный',
    '#DEB887': 'бежево-коричневый',
    '#F5F5F5': 'светло-серый',
    '#808080': 'серый',
    '#A9A9A9': 'тёмно-серый',
    '#C0C0C0': 'серебристый',
    '#2F4F4F': 'тёмно-сланцевый',
    '#FA8072': 'светло-красный',
    '#F08080': 'коралловый',
    '#CD5C5C': 'индийский красный',
    '#B22222': 'огненно-красный',
    '#FF7F50': 'коралловый',
    '#FFDEAD': 'нежно-персиковый',
    '#FFE4B5': 'мокко',
    '#FFE4C4': 'бисквитный',
    '#FFDAB9': 'персиковый',
    '#EEE8AA': 'бледно-жёлтый',
    '#F0FFF0': 'мята',
    '#F5FFFA': 'мятно-белый',
    '#F0FFFF': 'светлая циан',
    '#F0F8FF': 'алисовый голубой',
    '#E6E6FA': 'лаванда',
    '#DDA0DD': 'сливовый',
    '#DA70D6': 'орхидея',
    '#FF00FF': 'фуксия',
    '#FF1493': 'ярко-розовый',
    '#C71585': 'тёмно-розовый',
    '#DB7093': 'бледно-розовый',
    '#FFB6C1': 'светло-розовый',
    '#FFAEB9': 'розовато-красный',
    '#7FFF00': 'ярко-зелёный',
    '#7CFC00': 'ярко-зелёный',
    '#00FA9A': 'средне-мятный',
    '#00FF7F': 'весенне-зелёный',
    '#3CB371': 'средне-зелёный',
    '#2E8B57': 'морская зелень',
    '#66CDAA': 'светло-мятный',
    '#8FBC8F': 'тёмно-мятный',
    '#20B2AA': 'светло-бирюзовый',
    '#5F9EA0': 'кадет-синий',
    '#4682B4': 'стальной синий',
    '#B0C4DE': 'светло-стальной',
    '#ADD8E6': 'светло-голубой',
    '#87CEFA': 'светло-небесный',
    '#00BFFF': 'глубокий небесный',
    '#0000CD': 'средне-синий',
    '#9400D3': 'тёмно-фиолетовый',
    '#CD853F': 'персиково-коричневый',
    '#F4A460': 'песочно-коричневый',
    '#D2B48C': 'золотисто-коричневый',
    '#BC8F8F': 'розовато-коричневый',
    '#F5DEB3': 'пшеничный',
    '#FFEBCD': 'миндальный',
    '#FFEFD5': 'папайя-шелк',
    '#FFF8DC': 'кукурузный',
    '#7B68EE': 'средне-синий фиолетовый',
    '#6A5ACD': 'средне-сливовый',
    '#483D8B': 'тёмно-сливовый',
    '#8B008B': 'тёмно-фиолетовый',
    '#6B8E23': 'оливково-зелёный',
    '#556B2F': 'тёмно-оливковый',
    '#808000': 'оливковый',
    '#9ACD32': 'ярко-зелёный',
    '#7FFFD4': 'аквамарин',
    '#800000': 'тёмно-коричневый',
  };
  const getRuName = (hex: string) => {
    const key = hex.trim().toUpperCase();
    return hexToRuName[key] ?? 'кастомный';
  };

  defineProps<IColorPickerProps>();

  const model = defineModel<string>();

  const isOpen = ref<boolean>(false);

  const nameColor = computed(() => getRuName(model.value!));
</script>

<template>
  <UiFieldContainer :error="error" :label="label" @on-click="isOpen = !isOpen">
    <div class="ui-color-select">
      <input :tabindex="0" id="val" :value="nameColor" disabled />
      <div style="display: flex; gap: 10px; align-items: center">
        <ColorPreview :value="model || '#000'" :width="24" :height="24" />
        <svg
          :style="`rotate: ${isOpen ? 0 : 180}deg`"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
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
      </div>
    </div>
  </UiFieldContainer>
  <ColorPicker v-if="isOpen" v-model="model" />
</template>

<style lang="scss">
  .ui-color-select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    min-height: 24px;

    input:disabled {
      pointer-events: none;
      background-color: transparent;
    }
  }
</style>
