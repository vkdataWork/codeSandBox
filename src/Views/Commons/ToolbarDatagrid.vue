<template>
    <div key="count">
        <DxToolbar>
            <DxItemToolbar test-id="AB-ActionBar.vue-3" name-id="create" @click="$emit('actionBarEvent', $event)"
                :visible="props.menuItems?.create ?? false" :disabled="props.menuItems?.createDisabled" :options="{
                    icon: IconClassEnum.create,
                    hint: t('ActionBar.Create'),
                    elementAttr: { 'test-id': 'AB-ActionBar.vue-3', name: 'create' },
                }" location="before" widget="dxButton" />
            <DxItemToolbar test-id="AB-ActionBar.vue-6" name-id="setState" @click="$emit('actionBarEvent', $event)"
                :visible="props.menuItems?.setState ?? false" :disabled="props.menuItems?.setStateDisabled" :options="{
                    icon: IconClassEnum.setState,
                    hint: t('Dashboard.SetState'),
                    elementAttr: { 'test-id': 'AB-ActionBar.vue-6', name: 'setState' },
                }" location="after" widget="dxButton" />
            <DxItemToolbar name="separator" v-if="props.menuItems?.getState"/>
            <DxItemToolbar
                test-id=" AB-ActionBar.vue-5" name-id="getState" @click="$emit('actionBarEvent', $event)"
                :visible="props.menuItems?.getState ?? false" :disabled="props.menuItems?.getStateDisabled" :options="{
                    icon: IconClassEnum.getState,
                    hint: t('Dashboard.GetState'),
                    elementAttr: { 'test-id': 'AB-ActionBar.vue-5', name: 'getState' },
                }" location="after" widget="dxButton" />

            <DxItemToolbar name="separator" v-if="props.menuItems?.removeState"/>
            <DxItemToolbar test-id="AB-ActionBar.vue-7" name-id="removeState" @click="$emit('actionBarEvent', $event)"
                :visible="props.menuItems?.removeState ?? false" :disabled="props.menuItems?.removeStateDisabled"
                :options="{
                    icon: IconClassEnum.removeState,
                    hint: t('Dashboard.ResetState'),
                    elementAttr: { 'test-id': 'AB-ActionBar.vue-7', name: 'removeState' },
                }" location="after" widget="dxButton" />
            <DxItemToolbar name="separator" />
            <DxItemToolbar test-id="AB-ActionBar.vue-8" name-id="initialState" @click="$emit('actionBarEvent', $event)"
                :visible="props.menuItems?.initialState ?? false" :disabled="props.menuItems?.initialStateDisabled"
                :options="{
                    icon: IconClassEnum.initialState,
                    hint: t('Dashboard.InitialState'),
                    elementAttr: { 'test-id': 'AB-ActionBar.vue-8', name: 'initialState' },
                }" location="after" widget="dxButton" />
        </DxToolbar>
    </div>
</template>

<script setup lang="ts">
import DxToolbar, { DxItem as DxItemToolbar } from 'devextreme-vue/toolbar';
import { DxItem } from 'devextreme-vue/toolbar';
import { ActionBarMenuType } from '@/Types/ActionBarMenuType';
import { useI18n } from 'vue-i18n';
import { DisplayValueType } from '@/Types/DisplayValueType';
import { onMounted, onUpdated, ref, watch } from 'vue';
import { IconClassEnum } from '@/Types/IconClassEnum';

const { t } = useI18n();
let props = defineProps({
    pageTitle: {},
    pageComments: {
        type: String,
        default: '',
        required: false,
    },
    menuItems: {
        type: Object as () => ActionBarMenuType,
        default: {
            getState: false,
            setState: false,
            removeState: false,
            initialState: false,
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
    value: {
        type: Number,
        default: 0,
        required: false,
    },
});
let selectRenderKey = ref(0);
let emits = defineEmits(['actionBarSearchEvent', 'actionBarEvent', 'twoRows']);

function onSelectionChanged(e: any) {
    emits('actionBarSearchEvent', e);
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
</style>
