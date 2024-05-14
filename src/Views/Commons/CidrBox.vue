<template>
  <div class="dx-texteditor-input-container" :key="count">
    <div ref="cidr1" class="dx-texteditor-input" />
    <span>&nbsp.&nbsp</span>
    <div ref="cidr2" class="dx-texteditor-input" />
    <span>&nbsp.&nbsp</span>
    <div ref="cidr3" class="dx-texteditor-input" />
    <span>&nbsp.&nbsp</span>
    <div ref="cidr4" class="dx-texteditor-input cidr4" />
    <span v-if="props.isCidr">&nbsp/&nbsp</span>
    <div v-if="props.isCidr" ref="cidrMask" class="dx-texteditor-input" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUpdated, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import dxNumberBox from 'devextreme/ui/number_box';

const { t } = useI18n();
let count = ref(0);
let cidr1 = ref();
let cidr2 = ref();
let cidr3 = ref();
let cidr4 = ref();
const cidrMask = ref();
let props = defineProps({
  values: {
    type: Object,
    required: true,
  },
  isCidr: {
    type: Boolean,
    default: true,
  },
});
let address = reactive({
  address1: 0,
  address2: 0,
  address3: 0,
  address4: 0,
  netmask: 24,
});

let emit = defineEmits(['update:cidr', 'update:inet']);

onMounted(() => {
  init();
});

onUpdated(() => {
  init();
});

function init() {
  cidr1.value = new dxNumberBox(cidr1.value, {
    value: getValue(0) || 0,
    onValueChanged: (e) => {
      valueChanged('Address1', e);
    },
    min: 0,
    max: 255,
    format: {},
  });
  cidr2.value = new dxNumberBox(cidr2.value, {
    value: getValue(1) || 0,
    onValueChanged: (e) => {
      valueChanged('Address2', e);
    },
    min: 0,
    max: 255,
    format: {},
  });
  cidr3.value = new dxNumberBox(cidr3.value, {
    value: getValue(2) || 0,
    onValueChanged: (e) => {
      valueChanged('Address3', e);
    },
    min: 0,
    max: 255,
    format: {},
  });
  cidr4.value = new dxNumberBox(cidr4.value, {
    value: getValue(3) || 0,
    onValueChanged: (e) => {
      valueChanged('Address4', e);
    },
    tabIndex: props.isCidr ? -1 : 0,
    readOnly: props.isCidr,
    min: 0,
    max: 255,
    format: {},
  });
  if (props.isCidr) {
    cidrMask.value = new dxNumberBox(cidrMask.value, {
      value: Number(
        props.values.value != null && props.values.value.Netmask != undefined
          ? props.values.value.Netmask
          : 24,
      ),
      tabIndex: props.isCidr ? 0 : -1,
      onValueChanged: (e) => {
        valueChanged('Netmask', e);
      },
      min: 0,
      max: 32,
    });
  }
}

function getValue(index: any) {
  try {
    if (props.isCidr) {
      return props.values.value.Address.split('.')[index];
    } else {
      return props.values.value.split('.')[index];
    }
  } catch (e) {
    return 0;
  }
}

function getNumberBox(name: any) {
  if (name === 'Address1') {
    return cidr1.value as dxNumberBox;
  } else if (name === 'Address2') {
    return cidr2.value as dxNumberBox;
  } else if (name === 'Address3') {
    return cidr3.value as dxNumberBox;
  } else if (name === 'Address4') {
    return cidr4.value as dxNumberBox;
  } else if (name === 'Netmask') {
    return cidrMask.value as dxNumberBox;
  }
}
function valueChanged(name: any, e: any) {
  if (name === 'Address1') {
    address.address1 = e.value;
    address.address2 = (getNumberBox('Address2') as any).option('value');
    address.address3 = (getNumberBox('Address3') as any).option('value');
    address.address4 = (getNumberBox('Address4') as any).option('value');
    props.isCidr
      ? (address.netmask = (getNumberBox('Netmask') as any).option('value'))
      : '';
  } else if (name === 'Address2') {
    address.address2 = e.value;
    address.address1 = (getNumberBox('Address1') as any).option('value');
    address.address3 = (getNumberBox('Address3') as any).option('value');
    address.address4 = (getNumberBox('Address4') as any).option('value');
    props.isCidr
      ? (address.netmask = (getNumberBox('Netmask') as any).option('value'))
      : '';
  } else if (name === 'Address3') {
    address.address3 = e.value;
    address.address1 = (getNumberBox('Address1') as any).option('value');
    address.address2 = (getNumberBox('Address2') as any).option('value');
    address.address4 = (getNumberBox('Address4') as any).option('value');
    props.isCidr
      ? (address.netmask = (getNumberBox('Netmask') as any).option('value'))
      : '';
  } else if (name === 'Address4') {
    address.address4 = e.value;
    address.address1 = (getNumberBox('Address1') as any).option('value');
    address.address2 = (getNumberBox('Address2') as any).option('value');
    address.address3 = (getNumberBox('Address3') as any).option('value');
    props.isCidr
      ? (address.netmask = (getNumberBox('Netmask') as any).option('value'))
      : '';
  } else if (name === 'Netmask') {
    address.netmask = e.value;
    address.address1 = (getNumberBox('Address1') as any).option('value');
    address.address2 = (getNumberBox('Address2') as any).option('value');
    address.address3 = (getNumberBox('Address3') as any).option('value');
    address.address4 = (getNumberBox('Address4') as any).option('value');
  }
  let caption = props.values.column.caption;
  let value = {
    Address: `${address.address1}.${address.address2}.${address.address3}.${address.address4}`,
    Netmask: address.netmask != undefined ? Number(address.netmask) : 0,
  };
  props.isCidr
    ? emit('update:cidr', caption, value)
    : emit('update:inet', caption, value.Address);
}

watch(
  () => props.values.Address,
  (val) => {
    address.address1 = Number(val.split('.')[0]);
    address.address2 = Number(val.split('.')[1]);
    address.address3 = Number(val.split('.')[2]);
    address.address4 = Number(val.split('.')[3]);
  },
);
</script>

<style scoped></style>
