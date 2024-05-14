<template>
    <div class="dx-texteditor-input-container">
        <div ref="mac1" class="dx-texteditor-input" />
        <span>&nbsp:&nbsp</span>
        <div ref="mac2" class="dx-texteditor-input" />
        <span>&nbsp:&nbsp</span>
        <div ref="mac3" class="dx-texteditor-input" />
        <span>&nbsp:&nbsp</span>
        <div ref="mac4" class="dx-texteditor-input" />
        <span>&nbsp:&nbsp</span>
        <div ref="mac5" class="dx-texteditor-input" />
        <span>&nbsp:&nbsp</span>
        <div ref="mac6" class="dx-texteditor-input" />
    </div>
    <div v-if="props.isInvalid" class="underNote dx-field-item-label-text">* {{ t('DataWareHouse.MacAddressError') }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import dxTextBox from 'devextreme/ui/text_box';

const { t } = useI18n();

let mac1 = ref();
let mac2 = ref();
let mac3 = ref();
let mac4 = ref();
let mac5 = ref();
let mac6 = ref();
let macAddress = ref(new Array<string>());
let props = defineProps({
    values: {
        type: Object,
        required: true,
    },
    isInvalid:{
        type:Boolean,
        required:true,
        default:false
    }
});
let address = reactive({
    address1: '00',
    address2: '00',
    address3: '00',
    address4: '00',
    address5: '00',
    address6: '00',
});
let emit = defineEmits(['update:macaddress']);
onMounted(() => {
    if (props.values.value != undefined) {
        macAddress.value = props.values.value.match(/.{1,2}/g) || [];
        const [address1, address2, address3, address4, address5, address6] = macAddress.value;
        address = {
            address1,
            address2,
            address3,
            address4,
            address5,
            address6,
        };
    }
    mac1.value = new dxTextBox(mac1.value, {
        value: macAddress.value ? macAddress.value[0] : '',
        onValueChanged: (e) => {
            valueChanged('Address1', e);
        },
        mask: 'AA',
        format: {},
    });
    mac2.value = new dxTextBox(mac2.value, {
        value: macAddress.value ? macAddress.value[1] : '',
        onValueChanged: (e) => {
            valueChanged('Address2', e);
        },
        mask: 'AA',
        format: {},
    });
    mac3.value = new dxTextBox(mac3.value, {
        value: macAddress.value ? macAddress.value[2] : '',
        onValueChanged: (e) => {
            valueChanged('Address3', e);
        },
        mask: 'AA',
        format: {},
    });
    mac4.value = new dxTextBox(mac4.value, {
        value: macAddress.value ? macAddress.value[3] : '',
        onValueChanged: (e) => {
            valueChanged('Address4', e);
        },
        mask: 'AA',
        format: {},
    });
    mac5.value = new dxTextBox(mac5.value, {
        value: macAddress.value ? macAddress.value[4] : '',
        onValueChanged: (e) => {
            valueChanged('Address5', e);
        },
        mask: 'AA',
        format: {},
    });
    mac6.value = new dxTextBox(mac6.value, {
        value: macAddress.value ? macAddress.value[5] : '',
        onValueChanged: (e) => {
            valueChanged('Address6', e);
        },
        mask: 'AA',
        format: {},
    });
});

function valueChanged(name: any, e: any) {
    if (name === 'Address1') {
        address.address1 = e.value;
    } else if (name === 'Address2') {
        address.address2 = e.value;
    } else if (name === 'Address3') {
        address.address3 = e.value;
    } else if (name === 'Address4') {
        address.address4 = e.value;
    } else if (name === 'Address5') {
        address.address5 = e.value;
    } else if (name === 'Address6') {
        address.address6 = e.value;
    }
    let caption = props.values.column.caption;
    let value = `${address.address1}:${address.address2}:${address.address3}:${address.address4}:${address.address5}:${address.address6}`;
    emit('update:macaddress', caption, value);
}
</script>

<style scoped>
.underNote {
  padding-top: 0.2rem;
  font-size: 0.7rem;
  color:#f44336;
}
</style>
