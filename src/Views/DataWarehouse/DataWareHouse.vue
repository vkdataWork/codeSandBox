<template>
    <div class="scroll-wrapper">

        <div :key="count" v-if="tables">
            <DxDataGrid ref="dataGrid" class="responsive-paddings" :data-source="tables" key-expr="id"
                :show-borders="true" :show-row-lines="true" :show-column-lines="true" :allow-column-reordering="true"
                :allow-column-resizing="true" :allow-hiding="true" :column-auto-width="true" :allow-sorting="true"
                :focused-row-enabled="true" :remote-operations="true" :repaint-changes-only="false"
                :columnHidingEnabled="true" :columnChooser="{
                    title: t('ColumnChooser'),
                    emptyPanelText: t('ColumnChooserEmtyText'),
                    position: {
                        my: 'center center',
                        at: 'center center',
                    },
                    enabled: true,
                    mode: 'dragAndDrop',
                    selection: {
                        allowSelectAll: true,
                        recursive: true,
                        selectByClick: true,
                    },
                }">

                <DxLoadPanel :enabled="false" />
                <DxColumnFixing :enabled="true" />
                <DxFilterPanel :visible="true" />
                <DxFilterBuilderPopup :position="filterBuilderPopupPosition" />
                <DxHeaderFilter :visible="true" />

                <DxSelection mode="multiple" />
                <DxSearchPanel :visible="true" />
                <DxFilterRow :visible="true" />
                <DxSorting mode="multiple" />
                <DxPaging :enabled="false" />
                <DxScrolling showScrollbar="onHover" mode="standard" row-rendering-mode="standard"
                    :preloadEnabled="true" :renderAsync="true" />
                <DxColumn data-field="id" data-type="number" :caption="t('ID')" :visible="false" sort-order="asc">
                </DxColumn>
                <DxColumn cssClass="booleanColumns" data-field="scheme" data-type="string"
                    :caption="t('DataWareHouse.Scheme')"></DxColumn>
                <DxColumn data-field="name" data-type="string" :caption="t('DataWareHouse.TableName')"></DxColumn>
                <DxColumn cssClass="booleanColumns" data-field="type" data-type="string"
                    :caption="t('DataWareHouse.DataType')"></DxColumn>
                <DxColumn data-field="comment" data-type="string" :caption="t('DataWareHouse.Comment')"></DxColumn>
                <DxColumn cssClass="booleanColumns" data-field="count" data-type="number" alignment="right"
                    :caption="t('Count')" :format="{
                        formatter: formatNumber,
                    }"></DxColumn>
                <DxColumn cssClass="booleanColumns" data-field="size" :format="formatBytes" alignment="right"
                    data-type="number" :caption="t('Size')"></DxColumn>
                <!-- <DxColumn data-field="projects" :caption="t('ApplicationMenu.Projects')" cell-template="tagsTemplate"
					:calculateCellValue="calculateProjectsValue" :calculateFilterExpression="calculateProjectsFilterExpression">
					<DxLookup :dataSource="projects" display-expr="name" value-expr="name" />
				</DxColumn> 
				<template #projectsTemplate="cell">
					<Tags :values="cell.data.data.projects" :tags="projects" />
				</template>-->
                <DxColumn cell-template="columnTemplate"></DxColumn>
                <template #columnTemplate="{ data }">
                    <ButtonsGroupTemplate :data="data" :buttons="buttons" class="buttonsColumn" />
                </template>
            </DxDataGrid>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
    DxDataGrid,
    DxLoadPanel,
    DxSearchPanel,
    DxColumnFixing,
    DxHeaderFilter,
    DxFilterPanel,
    DxToolbar,
    DxItem,
    DxFilterBuilderPopup,
    DxFilterRow,
    DxSorting,
    DxPaging,
    DxColumn,
    DxScrolling,
    DxSelection,
} from 'devextreme-vue/data-grid';
import { RouteNames } from '@/Plugins/Router/RouteNames';
import { ref, onMounted, watch, reactive, computed } from 'vue';
import DwhTableListEntity from '@/Types/Warehouse/DwhTableListEntity';
import { formatBytes, formatNumber } from '@/Classes/FormatingNumbers';
import { useI18n } from 'vue-i18n';
import notify from 'devextreme/ui/notify';
import dxDataGrid from 'devextreme/ui/data_grid';
import ButtonsGroupTemplate from '@/Views/Components/Datawarehouse/ButtonsGroupTemplate.vue';
import { ButtonType } from '@/Types/Datawarehouse/ButtonType';
import { IconClassEnum } from '@/Types/IconClassEnum';

const { t } = useI18n();
const store = useStore();
const router = useRouter();
let dataGrid = ref();
const route = useRoute();

const buttons = ref<ButtonType[]>([

    {
        identifier: 'Data',
        testIdPrefix: 'DWH-data',
        url: (e: any) => getUrlData(e),
        hint: t('Data'),
        cssClasses: (e: any, identifier: any) => getClasses(e, identifier),
        onClick: (e: any) => getData(e),
    },
]);
let count = ref(0);
let tables = ref<DwhTableListEntity[]>(store.getters['WarehouseModule/values']);
let selectedScheme = ref([]);
const filterBuilderPopupPosition = {
    of: window,
    at: 'top',
    my: 'top',
    offset: { y: 10 },
};
onMounted(() => {
    init();
});

function getDataGrid(): dxDataGrid | undefined {
    if (dataGrid.value === null || dataGrid.value === undefined) return undefined;
    return (dataGrid.value! as DxDataGrid).instance;
}


async function init() {
    getDataGrid()?.beginUpdate();
    await store
        .dispatch('WarehouseModule/load')
        .then(() => {
            tables = store.getters['WarehouseModule/values'];
        })
        .catch((error) => {
            console.log('error while tables dispatching', error);
            notify(`${t('DataWareHouse.TableNotLoaded')} - ${error.response.data}`, 'error', 6000);
        });
    count.value++;
    getDataGrid()?.endUpdate();
}

async function getData(e: any): Promise<void> {
    await router.push({
        name: RouteNames.DataWarehouseData,
        params: {
            scheme: e.row.data.scheme,
            table: e.row.data.name,
        },
    });
}

function getClasses(e: any, identifier: any): string {
    identifier = identifier.toLowerCase();
    let name = identifier == 'data'
        ? 'canMetadata'
        : '';
    let icon =
        name == 'canSelect'
            ? IconClassEnum.info
            : name == 'canMetadata' ? IconClassEnum.delete
                : '';

    let result = e.row.data[name] ? `${icon}` : `${icon} z-layer dx-state-disabled`;
    return result;
}

function getUrlData(e: any): string {
    const url = router.resolve({
        name: RouteNames.DataWarehouseData,
        params: {
            scheme: e.row.data.scheme,
            table: e.row.data.name,
        },
    });
    return url.href;
}
</script>
<style scoped></style>
