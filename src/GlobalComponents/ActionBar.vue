<template>
  <div class="formMenu" key="count">
    <div class="actionBar" v-if="props.pageTitle">
      <DxToolbar>
        <DxItem class="dx-card minpadding" location="before" :text="props.pageTitle" editor-type="dxTextBox"></DxItem>
      </DxToolbar>
    </div>
    <div class="actionBar" v-if="props.pageComments">
      <DxToolbar>
        <span class="comments">{{ props.pageComments }}</span>
        <DxItem :options="{
          elementAttr: { 'test-id': 'AB-ActionBar.vue-12' },
          cssClass: 'comments',
        }" location="before" editor-type="dxTextBox"></DxItem>
      </DxToolbar>
    </div>

    <DxToolbar v-if="props.menuItems">
      <DxItemToolbar test-id="AB-ActionBar.vue-1" name-id="back" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.back ?? false" :options="{
          icon: IconClassEnum.back,
          hint: t('ActionBar.Back'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-1', name: 'back' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar test-id="AB-ActionBar.vue-16" name-id="detail" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.detail ?? false" :options="{
          icon: IconClassEnum.version,
          hint: t('ActionBar.Detail'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-16', name: 'detail' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
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
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-18" name-id="editTitle" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.editTitle ?? false" :options="{
          icon: IconClassEnum.switch,
          hint: t('ActionBar.EditTitle'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-18', name: 'editTitle' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-12" name-id="edit" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.edit ?? false" :options="{
          icon: IconClassEnum.edit,
          hint: t('ActionBar.Edit'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-12', name: 'switch' },
        }" location="before" widget="dxButton" />

      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-17" name-id="remove" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.remove ?? false" :options="{
          icon: IconClassEnum.xmark,
          hint: t('ActionBar.Remove'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-17', name: 'remove' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
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
      <DxItemToolbar ref="intervalBox" test-id="AB-ActionBar.vue-15" name-id="interval" location="after"
        :visible="props.menuItems?.interval ?? false" :options="intervalBoxOptions" widget="dxSelectBox" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-2" name-id="save" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.save ?? false" :options="{
          icon: IconClassEnum.save,
          hint: t('ActionBar.Save'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-2', name: 'save' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar test-id="AB-ActionBar.vue-16" name-id="import" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.import ?? false" :disabled="props.menuItems?.importDisabled" :options="{
          icon: IconClassEnum.import,
          hint: t('ActionBar.Import'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-15', name: 'import' },
        }" location="before" widget="dxButton" />

      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-4" name-id="projects" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.project ?? false" :options="{
          icon: IconClassEnum.project,
          hint: t('ActionBar.Project'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-4', name: 'project' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />

      <DxItemToolbar template="separatorTemplate" menu-item-template="menuSeparatorTemplate" locate-in-menu="auto"
        location="after" v-if="props.menuItems.setState" />
      <template #menuSeparatorTemplate>
        <div class="toolbar-menu-separator" />
      </template>
      <template #separatorTemplate>
        <div class="toolbar-separator" />
      </template>
      <DxItemToolbar test-id="AB-ActionBar.vue-6" name-id="setState" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.setState ?? false" :disabled="props.menuItems?.setStateDisabled" :options="{
          icon: IconClassEnum.setState,
          hint: t('Dashboard.SetState'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-6', name: 'setState' },
        }" location="after" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-5" name-id="getState" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.getState ?? false" :disabled="props.menuItems?.getStateDisabled" :options="{
          icon: IconClassEnum.getState,
          hint: t('Dashboard.GetState'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-5', name: 'getState' },
        }" location="after" widget="dxButton" />

      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-7" name-id="removeState" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.removeState ?? false" :disabled="props.menuItems?.removeStateDisabled" :options="{
          icon: IconClassEnum.removeState,
          hint: t('Dashboard.ResetState'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-7', name: 'removeState' },
        }" location="after" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-8" name-id="initialState" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.initialState ?? false" :disabled="props.menuItems?.initialStateDisabled" :options="{
          icon: IconClassEnum.initialState,
          hint: t('Dashboard.InitialState'),
          elementAttr: {
            'test-id': 'AB-ActionBar.vue-8',
            name: 'initialState',
          },
        }" location="after" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-9" name-id="codeEditor" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.codeEditor ?? false" :options="{
          icon: IconClassEnum.code,
          hint: t('ActionBar.CodeEditor'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-9', name: 'codeEditor' },
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar test-id="AB-ActionBar.vue-10" name-id="import" @click="$emit('actionBarEvent', $event)"
        :visible="props.menuItems?.upload ?? false" :options="{
          icon: IconClassEnum.import,
          hint: t('ActionBar.UploadFile'),
          elementAttr: { 'test-id': 'AB-ActionBar.vue-10', name: 'import' },
          onClick: () => showUploadPopup(),
        }" location="before" widget="dxButton" />
      <DxItemToolbar name="separator" />
      <DxItemToolbar ref="selectBox" test-id="AB-ActionBar.vue-11" name-id="search" location="after"
        :visible="props.menuItems?.search ?? false" :options="selectBoxOptions" widget="dxSelectBox" />

      <DxItemToolbar name="separator" />
      <DxItem class="dx-card minpadding" location="after" :text="props.roleLabel" editor-type="dxTextBox"
        v-if="roleLabel.length > 0"></DxItem>
      <DxItemToolbar ref="selectBox" test-id="AB-ActionBar.vue-18" name-id="roles" location="after"
        :visible="props.menuItems?.roles ?? false" :options="roleBoxOptions" widget="dxSelectBox" />
      <DxItemToolbar template="separatorTemplate" menu-item-template="menuSeparatorTemplate" locate-in-menu="auto"
        location="after" v-if="props.menuItems.setState" />
    </DxToolbar>

    <div>
      <DxPopup ref="popup" class="popupIn" :width="popupWidth" :height="popupHeight" :visible="showUpload"
        :show-title="true" :show-close-button="true" :hide-on-click-outside="true" :title="t('DataSources.AddFile')">
        <DxFileUploader select-button-text="Select json file" :maxFileSize="1000000" name="file" label-text=""
          :allowed-file-extensions="['.json']" accept="json, application/json" :upload-url="testUrl"
          :uploadHeaders="uploadHeader" :upload-mode="'useButtons'" :uploadButtonText="t('CheckFile')"
          @upload-started="(e: any) => onUploadStarted(e)" @upload-error="(e: any) => onUploadError(e)"
          @uploaded="(e: any) => onUploaded(e)" @value-changed="(e: any) => onBeforeSend(e)">
        </DxFileUploader>
        <div :key="count">
          <div class="itemsPopup">
            <div class="item">
              <DxTextBox :value="file.Name" v-if="showLabels" :label="t('Name')" labelMode="outside"
                :onValueChanged="(e: any) => onValueChanged(e, 'name')">
              </DxTextBox>
            </div>
            <div class="item">
              <DxTextArea :value="file.Description" v-if="showLabels" :label="t('Description')" labelMode="outside"
                :onValueChanged="(e: any) => onValueChanged(e, 'description')">
              </DxTextArea>
            </div>
          </div>
          <div class="buttonsPopup">
            <div class="buttonsPopup">
              <DxButton :text="t('Upload')" @click="fileUpload" v-if="showLabels" />
            </div>
            <div class="buttonsPopup">
              <DxButton :text="t('Cancel')" @click="showUploadPopup" v-if="showLabels" />
            </div>
          </div>
        </div>
      </DxPopup>
    </div>
  </div>
</template>

<script setup lang="ts">
import DxToolbar, { DxItem as DxItemToolbar } from 'devextreme-vue/toolbar';
import { DxItem } from 'devextreme-vue/toolbar';
import { DxFileUploader } from 'devextreme-vue/file-uploader';
import { DxPopup, DxPosition, DxToolbarItem } from 'devextreme-vue/popup';
import { ActionBarMenuType } from '@/Types/ActionBarMenuType';
import { DisplayValueType } from '@/Types/DisplayValueType';
import { PropType, computed, onMounted, onUpdated, ref, watch } from 'vue';
import { IconClassEnum } from '@/Types/IconClassEnum';
import { UploadEndpoints } from '@/Types/UploadEndpoints';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { User } from 'oidc-client';
import notify from 'devextreme/ui/notify';
import DxTextBox from 'devextreme-vue/text-box';
import DxButton from 'devextreme-vue/button';
import DxTextArea from 'devextreme-vue/text-area';
import Axios from '@/Plugins/Axios';

const { t } = useI18n();
const store = useStore();
let nameDashboard = ref('');
let descriptionDashboard = ref('');
let showLabels = ref<boolean>(false);
let popupWidth = ref(window.innerWidth - 40 || 600);
let popupHeight = ref(window.innerHeight - 40 || 600);
let count = ref(0);
let file = ref({ Name: '', Description: '', Data: '' } as any);
let uploadHeader = computed(() => {
  if ((store.getters['AccountModule/user']() as User)?.access_token != null || ((store.getters['AccountModule/user']() as User)?.access_token) != undefined) {
    return {
      Authorization: `Bearer ${(store.getters['AccountModule/user']() as User).access_token}`,
    };
  }
});
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
      save: false,
      create: false,
      project: false,
      search: false,
      getState: false,
      setState: false,
      removeState: false,
      initialState: false,
      edit: false,
      view: false,
      switch: false,
      codeEditor: false,
      upload: false,
      interval: false,
      refresh: false,
      detail: false,
      remove: false,
      editTitle: false,
      label: false
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
  dataSource: {
    type: Object as () => DisplayValueType<Object>[],
    default: () => [],
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
  },
  uploadUrl: {
    type: String as PropType<UploadEndpoints>,
    default: '',
    required: false,
  },
  uploadMode: {
    type: String,
    default: 'POST',
    required: false,
  },
});
let selectRenderKey = ref(0);
const selectBoxOptions = {
  dataSource: props.dataSource,
  key: selectRenderKey.value,
  displayExpr: props.displayExpr,
  valueExpr: props.valueExpr,
  value: props.value,
  elementAttr: { 'test-id': 'AB-ActionBar.vue-11', name: 'search' },
  hint: t('ActionBar.TimeFilter'),
  onValueChanged: (e: any) => {
    onSelectionChanged(e);
  },
};

const roleBoxOptions = {
  dataSource: props.dataSource,
  key: selectRenderKey.value,
  displayExpr: props.displayExpr,
  valueExpr: props.valueExpr,
  value: props.value,
  elementAttr: { 'test-id': 'AB-ActionBar.vue-18', name: 'roles' },
  hint: t('ActionBar.TimeFilter'),
  width: '12rem',
  onValueChanged: (e: any) => {
    onSelectionChanged(e);
  },
};
const intervalBoxOptions = {
  dataSource: props.intervalSource,
  value: props.intervalValue,
  valueExpr: 'value',
  displayExpr: 'name',
  elementAttr: { 'test-id': 'AB-ActionBar.vue-15', name: 'interval' },
  hint: t('ActionBar.RefreshInterval'),
  onValueChanged: (e: any) => {
    onIntervalSelectionChanged(e);
  },
};
const projects = computed(() => store.getters['AccountModule/projectIds']());
let emits = defineEmits(['actionBarSearchEvent', 'actionBarIntervalEvent', 'actionBarEvent', 'twoRows', 'fileUploaded']);
let testUrl = computed(() => {
  let ipAddress = store.getters['AccountModule/urlWarehouseAPI'];
  let api = store.getters['DataSourcesModule/apiPath'];
  return `${ipAddress}/${api}/file`;
});
let apiUrl = computed(() => {
  let ipAddress = store.getters['AccountModule/urlWarehouseAPI'];
  let environment = store.getters['AccountModule/environment']();

  let api = props.uploadUrl;
  let prj = projects.value.length > 0 ? `&prj=${projects.value.join(',')}` : '';
  return `${ipAddress}/${api}?env=${environment}${prj}`;
});
let showUpload = ref<boolean>(false);

onMounted(() => {
  showLabels.value = false;
  props.pageComments.length > 0 ? emits('twoRows', true) : emits('twoRows', false);
});

onUpdated(() => {
  props.pageComments.length > 0 ? emits('twoRows', true) : emits('twoRows', false);
});

watch(() => props.dataSource, () => {
  selectRenderKey.value++;
}, { deep: true })

function onSelectionChanged(e: any) {
  emits('actionBarSearchEvent', e);
}

function onIntervalSelectionChanged(e) {
  emits('actionBarIntervalEvent', e);
}

function showUploadPopup() {
  showUpload.value = !showUpload.value;
}

function onUploaded(e: any) {
  file.value = JSON.parse(e.request.response);
  nameDashboard.value = file.value.Name;
  descriptionDashboard.value = file.value.Description;
  showLabels.value = true;
  notify(t('ActionBar.FileChecked'), 'success', 4000);
  store.commit('StatusModule/setIsLoading', false);
}

function onUploadError(e: any) {
  store.commit('StatusModule/setIsLoading', false);
  notify(t('ActionBar.FileNotUploaded') + ' - ' + e.error.statusText, 'error', 4000);
}

function onUploadStarted(e: any) {
  store.commit('StatusModule/setIsLoading', true);
}

function onBeforeSend(e: any) { }

async function fileUpload(e: any) {
  await Axios.post(apiUrl.value, file.value, {
    headers: uploadHeader.value,
  })
    .then((response) => {
      notify(t('ActionBar.FileUploaded'), 'success', 4000);
      emits('fileUploaded');
      showUploadPopup();
    })
    .catch((error) => {
      console.log('fileUpload', error);
      notify(`${t('ActionBar.FileNotUploaded')} - ${error.response.data ?? error.response.statusText}`, 'error', 6000);
    });
}

function onValueChanged(e: any, name: String): void {
  name == 'name' ? (file.value.Name = e.value) : (file.value.Description = e.value);
}
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
