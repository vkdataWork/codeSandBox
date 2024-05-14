<template>
  <div class="scroll-wrapper">
    <div v-if="columns && columnsType.length > 0" :key="count">
      <DxDataGrid ref="dataGrid" :key="render" class="datagrid responsive-paddings" :data-source="storeDataGrid"
        :columns="columns" :show-borders="true" :show-row-lines="true" :show-column-lines="true"
        :allow-column-reordering="true" :allow-column-resizing="true" :allow-adding="isDashboardItem"
        :error-row-enabled="false" :allow-hiding="true" :column-auto-width="true" :allow-sorting="true"
        :focused-row-enabled="true" :remote-operations="{ groupPaging: true }" :word-wrap-enabled="true"
        :onEditorPreparing="onEditorPreparing" :onSaving="onSaving" :onEditingStart="(e: any) => onEditingStart(e)">
        
        <DxLoadPanel :enabled="false" />
        <DxColumn v-for="(column, index) in columns" :key="index" :data-field="column" :caption="column"
          :customizeText="(e: any) => customizeText(e, column) || ''"
          :dataType="columnsType.find((x: any) => x.name == column).typeJS || 'string'"
          :cellTemplate="columnsType.find((x: any) => x.name == column).type == 'cidr' ? 'cidrGrid' : columnsType.find((x: any) => x.name == column).type == 'inet' ? 'inetGrid' : columnsType.find((x: any) => x.name == column).type == 'macaddr' ? 'macaddressGrid' : columnsType.find((x: any) => x.name == column).type == 'json' ? 'generalString' : columnsType.find((x: any) => x.name == column).type == 'xml' ? 'generalString' : columnsType.find((x: any) => x.name == column).type == 'text' ? 'generalString' : columnsType.find((x: any) => x.name == column).type == 'character varying' ? 'generalString' : columnsType.find((x: any) => x.name == column).type == 'character' ? 'generalString' : columnsType.find((x: any) => x.name == column).type == 'bytea' ? 'byteaGrid' : columnsType.find((x: any) => x.name == column).format.type == 'decimal' ? 'decimal' : columnsType.find((x: any) => x.name == column).type == 'interval' ? 'intervalGrid' : undefined"
          :editCellTemplate="columnsType.find((x: any) => x.name == column).type == 'cidr' ? 'cidr' : columnsType.find((x: any) => x.name == column).type == 'inet' ? 'inet' : columnsType.find((x: any) => x.name == column).type == 'macaddr' ? 'macaddress' : columnsType.find((x: any) => x.name == column).type == 'bytea' ? 'bytea' : columnsType.find((x: any) => x.name == column).type == 'interval' ? 'interval' : columnsType.find((x: any) => x.name == column).format.type == 'time' ? 'timebox' : columnsType.find((x: any) => x.name == column).format.type == 'timetz' ? 'zonebox' : undefined"
          :editorOptions="{
            invalidValueMessage: 'Value must be a number',
            min: Number(columnsType.find((x: any) => x.name ==
              column).min),
            max: Number(columnsType.find((x: any) => x.name == column).max),
            type: columnsType.find((x: any) => x.name == column).format.type,
            placeholder: columnsType.find((x: any) => x.name == column).format.placeholder,
            useMaskBehavior: columnsType.find((x: any) => x.name == column).format.useMaskBehavior,
            dateSerializationFormat: columnsType.find((x: any) => x.name == column).format.dateSerializationFormat,
            mask: columnsType.find((x: any) => x.name == column).format.mask,
            useMaskedValue: columnsType.find((x: any) => x.name == column).format.useMaskedValue,
          }">
          <DxAsyncRule :validation-callback="(e: any) => asyncValidation(e, column)" message="Input is invalid"
            v-if="isCustomColumn(column)" />
        </DxColumn>

        <template #cidr="{ data }">
          <cidr-box :values="data" :isCidr="true" @update:cidr="(e: any, values: any) => onCidrChanged(e, values)" />
        </template>
        <template #inet="{ data }">
          <cidr-box :values="data" :isCidr="false" @update:inet="(e: any, values: any) => onInetChanged(e, values)" />
        </template>
        <template #macaddress="{ data }">
          <mac-address-box :values="data" @update:macaddress="(e: any, value: any) => onMacAddressChanged(e, value)"
            :isInvalid="!isValid || false" />
        </template>
        <template #generalString="{ data }">
          <div>{{ getStringValue(data) }}</div>
        </template>
        <template #decimal="{ data, row }">
          <div>{{ data.value }}</div>
        </template>
        <template #interval="{ data }">
          <interval-box :values="data" @update:interval="(e: any, value: any) => onIntervalChanged(e, value)" />
        </template>
        <template #bytea="{ data }">

          <div v-if="data.value">
            <div style="display: flex; flex-direction: row" v-if="!hideImage">
              <img v-if="data.value" :src="getImage(data.value)" alt="No image" style="width: 30%; height: 30%" />
              <div class="deleteButtonGroup">
                <div type="button"
                  class="dx-box-item-content dx-widget dx-button dx-button-mode-contained dx-button-normal dx-button-text deleteButton"
                  aria-label="DELETE" :onclick="() => deleteImage(data)">
                  &nbsp;DELETE&nbsp;
                </div>
              </div>
            </div>
          </div>
          <div v-if="imageName != ''">
            <img v-if="rowIndexUploadedPhoto == data.column.dataField" :src="image" alt="Picture"
              style="width: 30%; height: 30%" />
            <img v-else :src="getImage(data.value)" alt="Picture" style="width: 30%; height: 30%" />
          </div>
        </template>
        <template #timebox="{ data }">
          <ZoneTimeBox :data="data" @update:valueChanged="(e: any) => onTimeZoneChanged(e.caption, e.value)"
            :zone="false" />
        </template>
        <template #zonebox="{ data }">
          <ZoneTimeBox :data="data" @update:valueChanged="(e: any) => onTimeZoneChanged(e.caption, e.value)"
            :zone="true" />
        </template>
        <template #cidrGrid="{ data }">
          <div ref="cidr">{{ getCidrValue(data) }}</div>
        </template>
        <template #inetGrid="{ data }">
          <div>{{ data.value }}</div>
        </template>
        <template #intervalGrid="{ data }">
          <div>{{ getIntervalValue(data) }}</div>
        </template>
        <template #macaddressGrid="{ data }">
          <div ref="macaddress">{{ getMacAddress(data) }}</div>
        </template>
        <template #byteaGrid="{ data }">
          <img v-if="data.value" :src="getImage(data.value)" alt="Picture" style="width: 1rem; height: 1rem" />
        </template>
        <DxEditing :allow-updating="allowEdit" :allow-deleting="allowEdit" mode="popup" :popup="{
          visible: popupVisible,
          showTitle: true, title: t('DataWareHouse.DataEditor'),
        }" />
        <DxScrolling showScrollbar="onHover" mode="virtual" row-rendering-mode="virtual" :preloadEnabled="true"
          :renderAsync="true" />
        <DxColumnFixing :enabled="true" />
        <DxFilterPanel :visible="true" />
        <DxFilterBuilderPopup :position="filterBuilderPopupPosition" />
        <DxLoadPanel :enabled="false" />
        <DxSearchPanel :visible="true" />
        <DxFilterRow :visible="true" />
        <DxSorting mode="multiple" />
        <DxPaging :page-size="25" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
      </DxDataGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ref, computed, onMounted, watch } from 'vue';
import IntervalBox from '@/Views/Commons/IntervalBox.vue';
import {
  DxDataGrid,
  DxSearchPanel,
  DxColumnFixing,
  DxColumn,
  DxPaging,
  DxLoadPanel,
  DxFilterPanel,
  DxEditing,
  DxAsyncRule,
  DxFilterBuilderPopup,
  DxItem as DxItemGrid,
  DxHeaderFilter,
  DxFilterRow,
  DxSorting,
  DxScrolling,
} from 'devextreme-vue/data-grid';
import { useI18n } from 'vue-i18n';
import { TableData } from '@/Types/Warehouse/TableData';
import CustomStore from 'devextreme/data/custom_store';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import dxDataGrid from 'devextreme/ui/data_grid';
import notify from 'devextreme/ui/notify';
import * as Utils from '@/Classes/FormatingNumbers';
import moment, { Duration } from 'moment';
import DialogFactory from '@/Classes/DialogueFactory';
import CidrBox from '@/Views/Commons/CidrBox.vue';
import MacAddressBox from '@/Views/Commons/MacAddressBox.vue';
import dxForm from 'devextreme/ui/form';
import ZoneTimeBox from '@/Views/Commons/ZoneTimeBox.vue';

const isDashboardItem = computed(() => {
  return route.path.includes('tableDataItem');
});
let byteaUploaded = ref();
let imageName = ref('');
let image = computed(() => getImage(byteaUploaded.value).toString());
let rowIndexUploadedPhoto = ref();
let hideImage = ref(false);
let isValid = ref(true);
const { t } = useI18n();
let popupVisible = ref(false);
const form = ref(null);
let isCreate = ref(true);
let count = ref(0 as number);
let valuesToAdd = ref({} as any);
const route = useRoute();
const store = useStore();
const dateFormat = 'DD.MM.yyyy';
const dateTimeFormat = 'DD.MM.yyyy HH:mm:ss';
const dateTimeWithZoneFormat = 'DD.MM.yyyy HH:mm:ssx';
const timeFormat = 'HH:mm:ss';
const timeWithZoneFormat = 'HH:mm:ssx';
const momentDateFormat = 'DD.MM.yyyy';
const momentDateTimeFormat = 'DD.MM.yyyy HH:mm:ss';
const momentDateTimeWithZoneFormat = 'DD.MM.yyyy HH:mm:ss Z';
const momentTimeFormat = 'HH:mm:ss';
const momentTimeWithZoneFormat = 'HH:mm:ss Z';
const momentIntervalFormat = 'HH:mm:ss';
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let render = ref(0);
let allowEdit = ref<boolean>(false);
let columns = ref<string[] | null>();
let keys = ref<Array<any>>([
  {
    name: '',
    isIdentity: false,
  },
]);
let tabledata = ref<TableData[] | null>();
let dataGrid = ref(null);
let columnsType = ref([] as any[]);

function isCustomColumn(column: any): boolean {
  let result = columnsType.value.find((x: any) => x.name == column).type == 'cidr' ? 'cidr' : columnsType.value.find((x: any) => x.name == column).type == 'inet' ? 'inet' : columnsType.value.find((x: any) => x.name == column).type == 'macaddr' ? 'macaddress' : columnsType.value.find((x: any) => x.name == column).type == 'bytea' ? 'bytea' : columnsType.value.find((x: any) => x.name == column).type == 'interval' ? 'interval' : columnsType.value.find((x: any) => x.name == column).format.type == 'time' ? 'time' : columnsType.value.find((x: any) => x.name == column).format.type == 'timetz' ? 'timetz' : undefined;
  return result == undefined;
}
let dataSource = computed((): CustomStore<TableData[], any> => {
  return createStore({
    loadUrl: `${store.getters['AccountModule/urlWarehouseAPI']}/warehouse/tabledata`,

    async onInserting(values) {
      for (const key in valuesToAdd.value) {
        if (key != 'data' && key != 'keys') values[key] = valuesToAdd.value[key];
      }
      valuesToAdd.value = {};
      values.table = route.params.table;
      values.scheme = route.params.scheme;
      store
        .dispatch('WarehouseModule/createData', values)
        .then(() => {
          notify(t('DataWareHouse.DataSaved'), 'success', 2000);

          init();
        })
        .catch((error) => {
          console.log(error);
          notify(`${t('DataWareHouse.DataNotSaved')}${error.response.data ?? error.response.statusText}`, 'error', 2000);
        });
    },
    insertUrl: `${store.getters['AccountModule/urlWarehouseAPI']}/warehouse`,
    insertMethod: 'POST',

    async onUpdating(key, values) {
      let data = store.getters['WarehouseModule/columns'];
      for (const key in valuesToAdd.value) {
        if (key != 'data' && key != 'keys') values[key] = valuesToAdd.value[key];
      }
      valuesToAdd.value = {};
      byteaUploaded.value = '';
      let updateData = {} as any;
      keys.value.forEach((x) => {
        updateData[x.name] = values[x.name] || key[x.name];
      });

      for (let x in updateData) {
        updateData[x] = key[x];
      }
      for (let x in values) {
        if (x != 'data' && x != 'keys') updateData[x] = values[x];
      }
      updateData.table = route.params.table;
      updateData.scheme = route.params.scheme;
      await store
        .dispatch('WarehouseModule/updateData', updateData)
        .then(() => {
          notify(t('DataWareHouse.DataSaved'), 'success', 2000);
          updateData = {};
          init();
        })
        .catch((error) => {
          console.log(error);
          notify(`${t('DataWareHouse.DataNotSaved')}${error.response.statusText}`, 'error', 6000);
        });
    },
    updateUrl: `${store.getters['AccountModule/urlWarehouseAPI']}/warehouse`,
    updateMethod: 'PUT',
    onRemoving(key) {
      key.table = route.params.table;
      key.scheme = route.params.scheme;
      store
        .dispatch('WarehouseModule/deleteData', key)
        .then(() => {
          notify(t('DataWareHouse.DataDeleted'), 'success', 2000);
          init();
        })
        .catch((error) => {
          console.log(error);
          notify(`${t('DataWareHouse.DataNotDeleted')}${error.response.data ?? error.response.statusText}`, 'error', 6000);
        });
    },
    deleteUrl: `${store.getters['AccountModule/urlWarehouseAPI']}/warehouse`,
    deleteMethod: 'DELETE',

    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.headers = {
        Table: encodeURI(route.params.table as string),
        Scheme: encodeURI(route.params.scheme as string)
      };
    },
  });
});

let storeDataGrid = new CustomStore<TableData[], any>({
  //  loadMode: "raw",
  load: function (loadOptions) {
    let options = loadOptions;
    return dataSource.value.load(options);
  },

  insert: (values) => {
    render.value++;
    return dataSource.value.insert(values);
  },
  update: function (key, values) {
    return dataSource.value.update(key, values);
  },
  remove: function (key) {
    return dataSource.value.remove(key);
  },
});
const filterBuilderPopupPosition = {
  of: window,
  at: 'top',
  my: 'top',
  offset: { y: 10 },
};

onMounted(async () => {
  await init();
});

function getDataGrid(): dxDataGrid | undefined {
  if (dataGrid.value === null || dataGrid.value === undefined) return undefined;
  return (dataGrid.value as DxDataGrid)?.instance;
}

function getType(e: any): void {
  columnsType.value = e.map((x: any) => {
    if (x.type === 'real') {
      x.typeJS = 'number';
      x.format = {
        showClearButton: true,
        useMaskBehavior: true,
        type: 'decimal',
        placeholder: '0.00',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = -999999;
      x.max = 999999;
      return x;
    } else if (x.type === 'decimal' || x.type === 'numeric' || x.type === 'double precision') {
      x.typeJS = 'number';
      x.format = {
        showClearButton: true,
        useMaskBehavior: true,
        type: 'decimal',
        placeholder: '0.00',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = -9999999999999999999999999998;
      x.max = 9999999999999999999999999998;
      return x;
    } else if (x.type === 'smallint') {
      x.typeJS = 'number';
      x.format = {
        precision: 0,
        showClearButton: true,
        useMaskBehavior: true,
        type: 'fixedPoint',
        placeholder: '0',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = -32768;
      x.max = 32767;
      return x;
    } else if (x.type === 'smallserial') {
      x.typeJS = 'number';
      x.format = {
        precision: 0,
        showClearButton: true,
        useMaskBehavior: true,
        type: 'fixedPoint',
        placeholder: '0',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = 1;
      x.max = 32767;
      return x;
    } else if (x.type === 'bigserial') {
      x.typeJS = 'number';
      x.format = {
        precision: 0,
        showClearButton: true,
        useMaskBehavior: true,
        type: 'fixedPoint',
        placeholder: '0',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = 1;
      x.max = 9223372036854775807;
      return x;
    } else if (x.type === 'serial') {
      x.typeJS = 'number';
      x.format = {
        precision: 0,
        showClearButton: true,
        useMaskBehavior: true,
        type: 'fixedPoint',
        placeholder: '0',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = 1;
      x.max = 2147483647;
      return x;
    } else if (x.type === 'integer' || x.type === 'int' || x.type == 'Int32') {
      x.typeJS = 'number';
      x.format = {
        precision: 0,
        showClearButton: true,
        useMaskBehavior: true,
        type: 'fixedPoint',
        placeholder: '0',
        useMaskValue: true,
      };
      x.editorType = 'dxNumberBox';
      x.min = -2147483648;
      x.max = 2147483647;
      return x;
    } else if (x.type === 'bigint' || x.type == 'Int64') {
      x.typeJS = 'string';
      x.format = {
        showClearButton: true,
      };
      x.editorType = 'dxTextBox';
      return x;
    }
    else if (x.type == 'boolean') {
      x.typeJS = 'boolean';
      x.format = {};
      x.editorType = 'dxCheckBox';
      return x;
    } else if (x.type === 'date') {
      x.editorType = 'dxDateBox';
      x.format = {
        displayFormat: dateFormat,
        showClearButton: true,
        useMaskBehavior: true,
        type: 'date',
        placeholder: moment(new Date()).format(momentDateFormat),
        dateSerializationFormat: 'yyyy-MM-dd',
        acceptCustomValue: true,
      };
      x.typeJS = 'date';
      return x;
    } else if (x.type == 'timestamp without time zone') {
      x.editorType = 'dxDateBox';
      x.format = {
        displayFormat: dateTimeFormat,
        showClearButton: true,
        type: 'datetime',
        placeholder: moment(new Date()).format(momentDateTimeFormat),
        dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
        acceptCustomValue: true,
      };
      x.typeJS = 'datetime';
      return x;
    } else if (x.type == 'timestamp with time zone') {
      x.editorType = 'dxDateBox';
      x.format = {
        displayFormat: dateTimeWithZoneFormat,
        showClearButton: true,
        type: 'datetime',
        placeholder: moment(new Date()).format(momentDateTimeWithZoneFormat),
        dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssxxx',
        acceptCustomValue: true,
      };
      x.typeJS = 'datetime';
      return x;
    } else if (x.type == 'time without time zone') {
      x.editorType = 'dxDateBox';
      x.format = {
        displayFormat: timeFormat,
        showClearButton: true,
        type: 'time',
        placeholder: moment(new Date()).format(momentTimeFormat),
        dateSerializationFormat: 'HH:mm:ss',
        acceptCustomValue: true,
      };
      x.typeJS = 'datetime';
      return x;
    } else if (x.type == 'time with time zone') {
      x.editorType = 'dxDateBox';
      x.format = {
        displayFormat: timeWithZoneFormat,
        showClearButton: true,
        type: 'timetz',
        placeholder: moment(new Date()).format(momentTimeWithZoneFormat),
        dateSerializationFormat: 'HH:mm:ss',
        acceptCustomValue: true,
      };
      x.typeJS = 'datetime';
      return x;
    } else {
      x.editorType = 'dxTextBox';
      x.format = {};
      x.typeJS = 'string';
      return x;
    }
  });
}

async function init() {
  getDataGrid()?.beginUpdate();
  await store
    .dispatch('WarehouseModule/loadKeys', {
      table: route.params.table,
      scheme: route.params.scheme,
    })
    .then(() => {
      keys.value = store.getters['WarehouseModule/keysColumn'];
      allowEdit.value = keys.value.length > 0 ? true : false;
      allowEdit.value == true ? render.value++ : DialogFactory.CreateAlertDialogue(t('DataWareHouse.EditDisabled')).show();
      keys.value = Array.from(new Set(keys.value));})
    .catch ((error) => {
        console.log(error);
        notify(`${t('DataWareHouse.DataNotAllowed')} - ${error.response.data ?? error.response.statusText}`, 'error', 6000);
      });
  await store
    .dispatch('WarehouseModule/nameload', {
      name: route.params.table,
      scheme: route.params.scheme,
    })
    .then(() => {
      columns.value = store.getters['WarehouseModule/columnsname'];
    })
    .then(() => {
      tabledata.value = store.getters['WarehouseModule/data'];
    })
    .catch((error) => {
      console.log(error);
      notify(`${t('DataWareHouse.DataNotAllowed')}- ${error.response.data ?? error.response.statusText}`, 'warning', 6000);
    });
  await store
    .dispatch('WarehouseModule/columnsload', {
      name: route.params.table,
      scheme: route.params.scheme,
    })
    .then(() => getType(store.getters['WarehouseModule/columns']))
    .catch((error) => {
      console.log(error);
      notify(`${t('DataWareHouse.DataNotAllowed')} ${error.response.data ?? error.response.statusText}`, 'warning', 6000);
    });
  getDataGrid()?.endUpdate();
  getDataGrid()?.refresh();
}

function onEditorPreparing(e: any) {
  if (keys.value !== undefined && keys.value.length > 0 && e.parentType != 'filterRow' && keys.value.includes(e.name)) {
    e.editorOptions.disabled = true;
  }
  if (keys.value !== undefined && keys.value.length > 0 && e.parentType != 'filterRow') {
    keys.value.find((x: any) => x.name == e.name)?.isIdentity == true ? (e.editorOptions.readOnly = true) : (e.editorOptions.readOnly = false);
  }
  columnsType.value.map((x: any) => {
    if (x.name == e.dataField) {
      e.dataType = x.typeJS;
    }
  });
}

function onSaving(e: any): void {
  if (isCreate.value == false && Object.keys(valuesToAdd.value).length > 1) {
    storeDataGrid.update(JSON.parse(JSON.stringify(valuesToAdd.value.keys)), JSON.parse(JSON.stringify(valuesToAdd.value)));
    isCreate.value = false;
    popupVisible.value = false;
  }
}

function onCidrChanged(caption: any, values: any) {
  valuesToAdd.value[caption] = values;
}

function onInetChanged(caption: any, values: any) {
  valuesToAdd.value[caption] = values;
}

function onTimeZoneChanged(caption: any, values: any) {
  let result = JSON.parse(JSON.stringify(values));
  valuesToAdd.value[caption] = result;
}

function saveButtonAllow(state: boolean) {
  let save = document.querySelector('div[role="button"][aria-label="Save"].dx-widget.dx-button.dx-button-mode-text.dx-button-default.dx-button-has-text[tabindex="0"]');
  save ? state ? save!.classList.remove('dx-state-disabled') : save!.classList.add('dx-state-disabled') : '';
}

function onMacAddressChanged(caption: any, values: any) {
  if (values.match(/^[\da-f]{2}([-:])([\da-f]{2}\1){4}[\da-f]{2}$/i)) {
    valuesToAdd.value[caption] = values;
    isValid.value = true;
    saveButtonAllow(true);
  } else { isValid.value = false; saveButtonAllow(false); isValid.value = false };
}

function onIntervalChanged(caption: any, values: any) {
  valuesToAdd.value[caption] = values;
}

function customizeText(e: any, column: any): any {
  if (e.target == 'headerFilter') { return e.valueText };
  let result = () => {
    try {
      return getFormattedValue(e, column);
    } catch (error) {
      console.log(error);
      return '';
    }
  };
  return result() != undefined ? (result().toString() as string) : '';
}

function getFormattedValue(data: any, column: any): any {
  let value = data.value;
  let type = columnsType.value.find((x) => x.name == column).type;
  if (type == 'date') {
    return moment(value).parseZone().format(momentDateFormat);
  } else if (type == 'timestamp without time zone') {
    return moment(value).parseZone().format(momentDateTimeFormat);
  } else if (type == 'timestamp with time zone') {
    return moment(value).parseZone().format(momentDateTimeWithZoneFormat);
  } else if (type == 'time without time zone') {
    //  return moment(value).format(momentTimeFormat);
    return value != null ? value.toString() : '';
  } else if (type == 'time with time zone') {
    return moment(value).parseZone().format(momentTimeWithZoneFormat);
  } else if (type == 'interval') {
    let result = () => {
      if (value != undefined || value != null) {
        const standardFormat = value.replace(/^(\d+)\.(\d{2}:\d{2}:\d{2})$/, '$1.$2');
        const duration: Duration = moment.duration(standardFormat);

        const days: number = Math.floor(duration.asDays());
        const remainingDuration: Duration = moment.duration(duration.subtract(moment.duration(days, 'days')));

        return `${days}.${moment.utc(remainingDuration.asMilliseconds()).format(momentIntervalFormat)}`;
      }
    };
    return result();
  } else if (type == 'boolean') {
    return value == true ? 'true' : 'false';
  } else if (
    type == 'serial' ||
    type == 'bigserial' ||
    type == 'smallserial' ||
    type == 'integer' ||
    type == 'numeric' ||
    type == 'real' ||
    type == 'smallint' ||
    type == 'bigint' ||
    type == 'int' ||
    type == 'Int32' ||
    type == 'Int64'
  ) {
    return Number(Utils.formatNumber(value));
  } else if (type == 'real' || type == 'decimal' || type == 'float' || type == 'double precision' || 'numeric' || type == 'money') {
    return Number(Utils.formatNumberWithDecimals(value));
  } else {
    return value;
  }
}

function getCidrValue(value: any): string {
  let result = ' ';
  if (value != undefined && value.value != null && value.value.Address != undefined && value.value.Netmask != undefined) {
    result = (value.value.Address + '/' + value.value.Netmask) as string;
  }
  return result;
}

function getIntervalValue(value: any): string {
  let result = ' ';
  if (value != undefined && value != null) {
    try {
      let data = JSON.parse(value.value.split(','));

      result = data[0] + ' ' + data[1] + ' ' + data[2] + ' ' + data[3] + ' : ' + data[4] + ' :' + data[5];
    } catch (e) {
      result = value.value;
    }
  }

  return result;
}

function getMacAddress(value: any): string {
  let result;
  if (value.value != undefined) {
    let macAddress = value.value.match(/.{1,2}/g);
    const [address1, address2, address3, address4, address5, address6] = macAddress;
    result = `${address1}:${address2}:${address3}:${address4}:${address5}:${address6}`;
  }
  return result;
}

function getStringValue(value: any): string {
  let result = '';
  if (value != undefined && value.value != null) {
    result = value.value as string;
  } else if (value != undefined && value.text != '') {
    const column = value.column.dataField; ''
    result = value.key[column];
  } else if (value != undefined && value.valueText != '') {
    result = value.valueText as string;
  }
  return result;
}

function onEditingStart(e: any) {
  valuesToAdd.value.keys = e.key;
  isCreate.value = false;
  popupVisible.value = true;
  isValid.value = true;
}

function getImage(file: any): any {
  return `data:image/png;base64,${file}`;
}

function deleteImage(data: any) {
  valuesToAdd.value[data.item.dataField] = null;
  hideImage.value = true;
}

async function asyncValidation(e: any, column: any): Promise<boolean> {
  const datatype = columnsType.value.find((x: any) => x.name == column).type;
  let result = await checkValue(datatype, e.value);
  saveButtonAllow(result);
  return result;
}

async function checkValue(datatype: any, value: any): Promise<any> {
  console.log(datatype, value);
  switch (datatype) {
    case 'integer':
      if (value == null || value == '') return true;
      try {
        return Number.isInteger(value) || BigInt(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'bigint':
      if (value == null || value == '') return true;
      try {
        return Number.isInteger(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'smallint':
      if (value == null || value == '') return true;
      try {
        return Number.isInteger(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'bigserial':
      if (value == null || value == '') return true;
      try {
        return Number.isInteger(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'smallserial':
      if (value == null || value == '') return true;
      try {
        return Number.isInteger(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'serial':
      if (value == null || value == '') return true;
      try {
        return Number.isInteger(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'json[]':
      if (value == null || value == '') return true;
      try {
        return Array.isArray(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'real':
      if (value == null || value == '') return true;
      try {
        return /^-?\d+(\.\d{1,6})?$/.test(value) && Math.abs(parseFloat(value)) <= 3.4028235e+38;
      } catch (e) {
        return false;
      };
    case 'double precision':
      if (value == null || value == '') return true;
      try {
        return /^[-+]?\d{1,15}(\.\d{1,15})?$/.test(value) && Math.abs(parseFloat(value)) <= 1.7976931348623157e+308;
      } catch (e) {
        return false;
      };
    case 'json':
      if (value == null || value == '') return true;
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      };
    case 'jsonb':
      if (value == null || value == '') return true;
      try {
        JSON.parse(value);
        return typeof value == 'object';
        return true;
      } catch (e) {
        return false;
      };
    case 'xml':
      if (value == null || value == '') return true;
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(value, 'text/xml');
        return (xmlDoc instanceof Document) ? true : false;
      } catch (e) {
        return false;
      };
    case 'array':
      if (value == null || value == '') return true;
      try {
        return Array.isArray(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'uuid':
      if (value == null || value == '') return true;
      try {
        return uuidRegex.test(value) ? true : false;
      } catch (e) {
        return false;
      };
    case 'character':
      if (value == null || value == '') return true;
      try {
        return typeof value === 'string' && value.length === 1 && value.charCodeAt(0) <= 65535;
      } catch (e) {
        return false;
      };
    case 'char':
      if (value == null || value == '') return true;
      try {
        return value.length === 1;
      } catch (e) {
        return false;
      };
    default:
      return true;
  }
}

</script>

<style scoped>
.deleteButtonGroup {
  justify-content: center;
  margin: 1rem;
  align-items: center;
  align-self: center;
}

.deleteButton {
  height: 100% !important;
  width: 100% !important;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
}
</style>
