<template>
    <div class="buttonBar">
        <div v-for="(item, index) in buttons" :key="index">
            <Popper v-if="item.visible === undefined || item.visible(data)" :hover="true" :placement="'bottom-end'"
                :arrow="false" :interactive="true">
                <a :test-id="getTestId(item, index)" type="button" @click.prevent="item.onClick(data)"
                    :href="item.url ? item.url(data) : '#'" :class="item.cssClasses(data, item.identifier)" />
                <template #content>
                    <div>{{ item.hint }}</div>
                </template>
            </Popper>
            <div class="separator" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import Popper from 'vue3-popper';
import { ButtonType } from '@/Types/Datawarehouse/ButtonType';

const { t } = useI18n();
let { buttons, data } = defineProps({
    buttons: {
        type: <PropType<Array<ButtonType>>>Array,

        required: true,
    },
    data: {
        type: Object as PropType<any>,
        required: true,
    },
});

function getTestId(e: any, index: any): string {
    return `${e.testIdPrefix}`;
}
</script>

<style scoped>
.z-layer {
    width: 100% !important;
    height: 100% !important;
    background-color: transparent !important;
    opacity: 0.5 !important;
}

.buttonBar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
}

.separator {
    margin-right: 0.8rem !important;
    margin-left: 0.8rem !important;
}

a {
    text-decoration: none !important;
}
</style>
