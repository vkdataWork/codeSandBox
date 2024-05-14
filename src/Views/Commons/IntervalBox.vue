<template>
  <div class="dx-texteditor-input-container" :key="count">
    <div ref="day" class="dx-texteditor-input" />
    <span>&nbsp&nbsp</span>
    <div ref="hour" class="dx-texteditor-input" />
    <span>&nbsp:&nbsp</span>
    <div ref="minute" class="dx-texteditor-input" />
    <span>&nbsp:&nbsp</span>
    <div ref="second" class="dx-texteditor-input" />
  </div>
  <div class="underNote dx-field-item-label-text">* {{ t('Day') }} - {{ t('Hour') }} - {{ t('Minute') }} - {{
    t('Second') }}</div>
</template>

<script setup lang="ts">
import { ref, reactive, onUpdated, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import dxNumberBox from 'devextreme/ui/number_box';

const { t } = useI18n();
let count = ref(0);

let day = ref();
let hour = ref();
const minute = ref();
const second = ref();
let props = defineProps({
  values: {
    type: Object,
    required: true,
  },
});
let interval = reactive({
  day: 0,
  hour: 0,
  minute: 0,
  second: 0,
});

let emit = defineEmits(['update:interval']);

onMounted(() => {
  init();
});

onUpdated(() => {
  init();
});

function init() {

  day.value = new dxNumberBox(day.value, {
    value: getValue('day') || 0,
    onValueChanged: (e) => {
      valueChanged('day', e);
    },
    format: {},
  });
  hour.value = new dxNumberBox(hour.value, {
    value: getValue('hour') || 0,
    onValueChanged: (e) => {
      valueChanged('hour', e);
    },
    format: {},
  });
  minute.value = new dxNumberBox(minute.value, {
    value: getValue('minute') || 0,
    onValueChanged: (e) => {
      valueChanged('minute', e);
    },
    min: 0,
    format: {},
  });
  second.value = new dxNumberBox(second.value, {
    value: getValue('second') || 0,
    onValueChanged: (e) => {
      valueChanged('second', e);
    },
    min: 0,
    max: 59,
    format: {},
  });
}

function getValue(index: any) {
  try {
    let val = props.values.value;
    if (props.values.value != null) {
      let days = val.split('.')[0] as number;
      let time = val.split('.')[1];

      if (time != null) {
        interval.day = days;
        interval.hour = time.split(':')[0] as number;
        interval.minute = time.split(':')[1] as number;
        interval.second = time.split(':')[2] as number;
      }
    }
    return interval[index];
  } catch (e) {
    console.log('interval', e);
    return 0;
  }
}

function valueChanged(name: any, e: any) {
  interval.day = day.value.option('value');
  interval.hour = hour.value.option('value') || 0;
  interval.minute = minute.value.option('value') || 0;
  interval.second = second.value.option('value') || 0;

  if (name === 'day') {
    interval.day = e.value;
  } else if (name === 'hour') {
    interval.hour = e.value;
  } else if (name === 'minute') {
    interval.minute = e.value;
  } else if (name === 'second') {
    interval.second = e.value;
  }
  let caption = props.values.column.caption;
  let value = `${interval.day}.${interval.hour}:${interval.minute}:${interval.second}`;
  emit('update:interval', caption, value);
}

watch(
  () => props.values,
  (val) => {
    let days = val.split('.')[0] as number;
    let time = val.split('.')[1];
    interval.day = days;
    interval.hour = time.split(':')[0] as number;
    interval.minute = time.split(':')[1] as number;
    interval.second = time.split(':')[2] as number;
  },
);
</script>

<style scoped>
.underNote {
  padding-top: 0.2rem;
  font-size: 0.7rem;
}
</style>
