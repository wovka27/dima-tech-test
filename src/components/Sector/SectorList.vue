<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import ColorPreview from '@/components/ColorPreview.vue';
  import BaseModal from '@/components/Modal/BaseModal.vue';
  import SectorItem from '@/components/Sector/SectorItem.vue';
  import ColorPicker from '@/components/Ui/ColorPicker.vue';
  import UiSelect from '@/components/Ui/Select/UiSelect.vue';
  import UiSelectItem from '@/components/Ui/Select/UiSelectItem.vue';
  import UiButton from '@/components/Ui/UiButton.vue';
  import UiColorSelect from '@/components/Ui/UiColorSelect.vue';
  import UiInput from '@/components/Ui/UiInput.vue';
  import type { Sector } from '@/types/sector.ts';

  const model = defineModel<Sector[]>({
    default: [],
  });

  const form = reactive<Sector>({
    color: '',
    name: '',
    value: '',
    id: '',
  });

  const colorOptions = reactive([
    { value: '#FF5733', label: 'Красно-оранжевый' },
    { value: '#FF8D1A', label: 'Оранжевый' },
    { value: '#FFC300', label: 'Жёлтый' },
    { value: '#DAF7A6', label: 'Салатовый' },
    { value: '#28B463', label: 'Зелёный' },
    { value: '#1F618D', label: 'Тёмно-синий' },
    { value: '#3498DB', label: 'Синий' },
    { value: '#5DADE2', label: 'Голубой' },
    { value: '#8E44AD', label: 'Фиолетовый' },
    { value: '#C39BD3', label: 'Сиреневый' },
    { value: '#E74C3C', label: 'Красный' },
    { value: '#F5B7B1', label: 'Розовый' },
    { value: '#A04000', label: 'Коричневый' },
    { value: '#D0D3D4', label: 'Серый' },
    { value: '#17202A', label: 'Чёрный' },
    { value: '#FFFFFF', label: 'Белый' },
  ]);

  const isOpen = ref<boolean>(false);
  const isEdit = ref<boolean>(false);

  const openModal = (id?: Sector['id']) => {
    isEdit.value = !!id;
    if (id) {
      const index = getCurrentSectorIndex(id);
      Object.assign(form, model.value[index]);
    }
    isOpen.value = true;
  };

  const resetForm = () => {
    Object.assign(form, {
      color: '',
      name: '',
      value: '',
      id: '',
    });
  };

  const getCurrentSectorIndex = (id: Sector['id']) => {
    return model.value.findIndex((sector) => sector.id === id);
  };

  const addSector = (data: Omit<Sector, 'id'>) => {
    model.value.push({ ...data, id: crypto.randomUUID() });
  };

  const removeSector = (id: Sector['id']) => {
    const index = getCurrentSectorIndex(id);

    if (index !== -1) model.value.splice(index, 1);
  };

  const editSector = (id: Sector['id']) => {
    const index = getCurrentSectorIndex(id);

    if (index !== -1) model.value.splice(index, 1, { ...model.value[index], ...form });
  };

  const onSubmit = (cb: () => void) => {
    if (isEdit.value) {
      editSector(form.id);
      cb();
      return;
    }

    addSector(form);

    cb();
  };

  const onCancel = () => {
    isEdit.value = false;
    resetForm();
  };
</script>

<template>
  <div class="sector-list">
    <SectorItem v-if="!model.length" is-empty />
    <template v-else>
      <SectorItem
        v-for="sector of model"
        :key="sector.id"
        :data="sector"
        @edit="openModal(sector.id)"
        @remove="removeSector(sector.id)"
      />
    </template>
    <UiButton class="sector-list__btn" @click="openModal()">Добавить сектор</UiButton>
    <BaseModal form-id="sector-modal" v-model="isOpen" title="HUI" @on-cancel="onCancel">
      <template #body="{ formId, closeModal }">
        <form class="sector-list__form" :id="formId" @submit.prevent="onSubmit(closeModal)">
          <UiInput label="Наименование" required v-model="form.name" />
          <UiInput label="Значение" required v-model="form.value" />
          <UiColorSelect label="Цвет" v-model="form.color" />
        </form>
      </template>
      <template #footer="{ formId }">
        <UiButton type="submit" :form="formId">Сохранить</UiButton>
      </template>
    </BaseModal>
  </div>
</template>

<style lang="scss">
  .sector-list {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }
  .sector-list__btn {
    margin-top: 25px;
  }
  .sector-list__form {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
</style>
