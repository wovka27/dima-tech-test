<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import BaseModal from '@/components/Modal/BaseModal.vue';
  import SectorItem from '@/components/Sector/SectorItem.vue';
  import ColorPicker from '@/components/Ui/ColorPicker.vue';
  import UiButton from '@/components/Ui/UiButton.vue';
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
  <div v-if="model.length" class="sector-list">
    <SectorItem
      v-for="sector of model"
      :key="sector.id"
      :data="sector"
      @edit="openModal(sector.id)"
      @remove="removeSector(sector.id)"
    />
    <UiButton class="sector-list__btn" @click="openModal()">Добавить сектор</UiButton>
    <BaseModal form-id="sector-modal" v-model="isOpen" title="HUI" @on-cancel="onCancel">
      <template #body="{ formId, closeModal }">
        <form class="sector-list__form" :id="formId" @submit.prevent="onSubmit(closeModal)">
          <UiInput label="Наименование" required v-model="form.name" />
          <UiInput label="Значение" required v-model="form.value" />
          <UiInput label="Цвет" required v-model="form.color" />
          <ColorPicker v-model="form.color" />
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
