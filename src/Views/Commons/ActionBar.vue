<template>
  <div class="formMenu" key="count">
    <div class="actionBar" v-if="props.pageTitle">
      <DxToolbar>
        <DxItem class="dx-card minpadding" location="before" :text="props.pageTitle" editor-type="dxTextBox"></DxItem>
      </DxToolbar>
    </div>

    <DxToolbar v-if="props.menuItems">
      <DxItemToolbar test-id="AB-ActionBar.vue-1" name-id="back" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.back ?? false" :options="{
          icon: IconClassEnum.back,
          hint: t('ActionBar.Back'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-1', name: 'back' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar test-id="AB-ActionBar.vue-9" name-id="switch" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.switch ?? false" :options="{
          icon: IconClassEnum.switch,
          hint: t('Dashboard.Switch'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-9', name: 'switch' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-3" name-id="create" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.create ?? false" :disabled="props.menuItems?.createDisabled" :options="{
          icon: IconClassEnum.create,
          cssClass: 'dx-icon dx-icon-edit-button-addrow',
          hint: t('ActionBar.Create'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-3', name: 'create' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-12" name-id="edit" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.edit ?? false" :options="{
          icon: IconClassEnum.edit,
          hint: t('ActionBar.Edit'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-12', name: 'switch' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar test-id="AB-ActionBar.vue-13" name-id="view" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.view ?? false" :options="{
          icon: IconClassEnum.view,
          hint: t('ActionBar.View'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-13', name: 'switch' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-14" name-id="refresh" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.refresh ?? false" :options="{
          icon: IconClassEnum.refresh,
          hint: t('ActionBar.Refresh'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-14', name: 'refresh' },
        }" location="after" widget="dxButton" />
      <DxItemToolbar test-id="AB-ActionBar.vue-2" name-id="save" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.save ?? false" :options="{
          icon: IconClassEnum.save,
          hint: t('ActionBar.Save'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-2', name: 'save' },
        }" location="before" widget="dxButton" />
    </DxToolbar>
  </div>
</template>

<script setup lang="ts">
import DxToolbar, { DxItem as DxItemToolbar } from 'devextreme-vue/toolbar';
import { DxItem } from 'devextreme-vue/toolbar';
import { ActionBarMenuType } from '@/Types/ActionBarMenuType';
import { PropType, computed, onMounted, onUpdated, ref, watch } from 'vue';
import { IconClassEnum } from '@/Types/IconClassEnum';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
let nameDashboard = ref('');
let descriptionDashboard = ref('');
let showLabels = ref<boolean>(false);
let props = defineProps({
  pageTitle: {},
  pageComments: {
    type: String,
    default: '',
    required: false,
  },
  roleLabel: {
    type: String, default: "",
    required: false
  },
  menuItems: {
    type: Object as () => ActionBarMenuType,
    default: {
      back: true,
    } as ActionBarMenuType,
  },
  displayExpr: {
    type: String,
    default: 'display',
    required: false,
  },
  valueExpr: {
    type: String,
    default: 'value',
    required: false,
  },

  intervalSource: {
    type: Array<Object>,
    default: () => [],
    required: false,
  },

  intervalValue: {
    type: String,
    default: 'no update',
    required: false,
  },
  value: {
    type: Number,
    default: 0,
    required: false,
  }
});
let selectRenderKey = ref(0);
let emits = defineEmits(['actionBarSearchEvent', 'actionBarIntervalEvent', 'actionBarEvent', 'twoRows', 'fileUploaded']);

onMounted(() => {
  showLabels.value = false;
  props.pageComments.length > 0 ? emits('twoRows', true) : emits('twoRows', false);
});

onUpdated(() => {
  props.pageComments.length > 0 ? emits('twoRows', true) : emits('twoRows', false);
});

</script>

<style lang="scss" scoped>
.actionBar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0px 00px 0px 0px;
}

.comments {
  font-size: small !important;
  font-style: italic !important;
  padding-left: 2dvw !important;
}

.toolbar-separator {
  height: 22px;
  margin: 0 10px;
  border-left: 1px solid #ddd;
}

.toolbar-menu-separator {
  height: 1px;
  border-bottom: 1px solid #ddd;
}

.itemsPopup {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.buttonsPopup {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
}

.item {
  padding: 0.5rem;
}
</style>
