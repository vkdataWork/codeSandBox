<template>
  <div class="dx-texteditor-input-container" v-if="items">
    <DxNumberBox :value="hours || 0" :onValueChanged="(e: any) => { hours = e.value; onChanged('hours', e); }" :min="0"
      class="dx-texteditor-input" :max="23" />
    <span>&nbsp&nbsp:&nbsp&nbsp</span>
    <DxNumberBox :value="minutes || 0" :onValueChanged="(e: any) => { ; minutes = e.value; onChanged('minutes', e) }"
      class=" dx-texteditor-input" :min="0" :max="59" />
    <span c>&nbsp&nbsp:&nbsp&nbsp</span>
    <DxNumberBox :value="seconds || 0" :onValueChanged="(e: any) => { seconds = e.value; onChanged('seconds', e); }"
      class="dx-texteditor-input" :min="0" :max="59" />
    <span>&nbsp&nbsp.&nbsp&nbsp</span>
    <DxNumberBox :value="miliseconds || 0"
      :onValueChanged="(e: any) => { miliseconds = e.value; onChanged('miliseconds', e); }" :min="0" :max="999"
      class="dx-texteditor-input" />
    <span v-if="hasZone">&nbsp&nbsp&nbsp&nbsp</span>
    <DxSelectBox :value="zone" :items="zones" v-if="hasZone" class="dx-texteditor-input"
      :onValueChanged="onZoneChanged">
    </DxSelectBox>
  </div>
  <div v-if="hasZone" class="underNote dx-field-item-label-text">{{ t('TimeZoneBox') }}</div>
  <div v-if="!hasZone" class="underNote dx-field-item-label-text">{{ t('TimeBox') }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUpdated, watch, computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import DxSelectBox from 'devextreme-vue/select-box';
import DxNumberBox from 'devextreme-vue/number-box';
import moment from 'moment';

const { t } = useI18n();
let hours = ref();
let minutes = ref();
let seconds = ref();
let miliseconds = ref();
let parsed = ref();
let zone = ref();
const hasZone = computed(() => props.zone);
const zones = computed(() => {
  let result = ['-12:00', '-11:00', '-10:00', '-09:00', '-08:00', '-07:00', '-06:00', '-05:00', '-04:00', '-03:00', '-02:00', '-01:00', '+00:00', '+01:00', '+02:00', '+03:00', '+04:00', '+05:00', '+06:00', '+07:00', '+08:00', '+09:00', '+10:00', '+11:00', '+12:00'];
  return result.reverse();
});
const items = ref<Array<String>>([]);
let props = defineProps({
  data: {
    type: Object as PropType<any | null | undefined> | null,
    required: false,
  },
  zone: {
    type: Boolean,
    required: false,
    defalut: false
  }
});

let emit = defineEmits(['update:valueChanged']);

onMounted(() => {
  init();
});

onUpdated(() => {
  // init();
});

function init() {
  parseValue();
}

function parseValue(): void {
  if (hasZone.value) {
    parsed.value = moment(props.data.value!);
    try {
      hours.value = parsed.value.hour();
      minutes.value = parsed.value.minute();
      seconds.value = parsed.value.second();
      miliseconds.value = parsed.value.milliseconds();
      let timezoneOffset = new Date(props.data.value).getTimezoneOffset();
      let absTimezoneOffset = Math.abs(timezoneOffset) < 60 ? 60 : Math.abs(timezoneOffset);
      let timezoneHours = String(Math.floor(absTimezoneOffset / 60)).padStart(2, '0');
      let timezoneMinutes = String(absTimezoneOffset % 60).padStart(2, '0');
      zone.value = `${timezoneOffset < 0 ? '+' : '-'}${timezoneHours}:${timezoneMinutes}`;
    } catch (e) {

    };
  };
  if (!hasZone.value) {
    try {
      [hours.value, minutes.value, seconds.value] = props.data.value.split(':').map(Number);
      [seconds.value, miliseconds.value] = seconds.value.toString().split('.').map(Number);
    } catch (e) { };
  };
}

function onChanged(name: any, e: any) {
  zone.value == '-NaN:NaN' || zone.value == '-NaN:NaN' ? emitChanges(hasZone.value ? `${getTimeString()}+01:00` : getTimeString()) : emitChanges(hasZone.value ? `${getTimeString()}${zone.value}` : getTimeString());
}

function onZoneChanged(e: any) {
  if (e.value == '-NaN:NaN') return;
  try {
    let [fullMatch, sign, hours, minutes] = e.value.match(/([-+])(\d{2}):(\d{2})/).map((str: any, index: any) => (index === 1 ? str : Number(str)));
    let offset = (hours + minutes) < 60 ? 1 : (hours + minutes);
    let offsetString = offset.toString().padStart(2, '0') + ":00";
    emitChanges(hasZone.value ? `${getTimeString()}${sign}${offsetString}` : `getTimeString()`);
  } catch (e) { };
}

function getTimeString(): String {
  return `${hours.value.toString().padStart(2, '0')}:${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}.${miliseconds.value.toString().padStart(3, '0')}`;
}

function emitChanges(value: any): void {
  emit('update:valueChanged', { caption: props.data.column.caption, value: value });
}
</script>

<style scoped></style>