<template>
	<div class="scroll-wrapper">

		<div :key="count" v-if="dashboards">
			<DxDataGrid ref="dataGrid" class="responsive-paddings" :data-source="dashboards" key-expr="id"
				:show-borders="true" :show-row-lines="true" :show-column-lines="true" :allow-column-reordering="true"
				:allow-column-resizing="true" :columnHidingEnabled="false" :columnChooser="{
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
				}" :column-auto-width="true" :allow-sorting="true" :focused-row-enabled="true" :word-wrap-enabled="true">
				<DxToolbar :visible="true">
					<DxItem :location="'after'" :locate-in-menu="'auto'">
					</DxItem>
					<DxItem name="columnChooserButton" :location="'before'" :locate-in-menu="'before'" />
					<DxItem name="searchPanel" :location="'after'" :locate-in-menu="'auto'" />
				</DxToolbar>
				<DxPaging :enabled="false" />
				<DxScrolling showScrollbar="virtual" mode="virtual" />
				<DxLoadPanel :enabled="false" />

				<DxColumnFixing :enabled="true" />
				<DxFilterPanel :visible="true" />
				<DxFilterBuilderPopup :position="filterBuilderPopupPosition" />
				<DxHeaderFilter :visible="true" />
				<DxEditing mode="popup" :allow-updating="true" :allow-adding="false" :allow-deleting="false">
					<DxPopup ref="popup" :width="700" :height="525" :show-title="true"
						:title="t('Dashboard.DashboardEditDescription')" :visible="true" />
					<DxForm col-count="1">
						<DxItem data-field="name" editor-type="dxTextBox" :disabled="true" :editor-options="{}">
						</DxItem>
						<DxItem ref="descriptionRef" data-field="description" editor-type="dxTextArea"></DxItem>
					</DxForm>
				</DxEditing>

				<DxSelection mode="multiple" />
				<DxSearchPanel :visible="true" />
				<DxFilterRow :visible="true" />
				<DxSorting mode="multiple" />
				<DxColumn cssClass="booleanColumns" data-field="id" data-type="number" caption="Id"
					:allow-editing="false" sort-order="asc" :allowHiding="true"></DxColumn>
				<DxColumn data-field="name" data-type="string" :allow-editing="false" :caption="t('Name')"
					:allowHiding="true"></DxColumn>
				<DxColumn data-field="description" :caption="t('Description')" :allowHiding="true"></DxColumn>
				<!-- <DxColumn data-field="projects" :caption="t('ApplicationMenu.Projects')" cell-template="tagsTemplate"
					:calculateCellValue="calculateProjectsValue" :calculateFilterExpression="calculateProjectsFilterExpression">
					<DxLookup :dataSource="projects" display-expr="name" value-expr="name" />
				</DxColumn> 
				<template #projectsTemplate="cell">
					<Tags :values="cell.data.data.projects" :tags="projects" />
				</template>-->
				<DxColumn cell-template="columnTemplate" type="buttons"> </DxColumn>
				<template #columnTemplate="{ data }">
					<ButtonsGroupTemplate :data="data" :buttons="buttons" class="buttonsColumn" />
				</template>

			</DxDataGrid>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ManipulationGridState } from '@/Views/Commons/ManipulationGridState';
import {
	DxDataGrid,
	DxEditing,
	DxPaging,
	DxSearchPanel,
	DxColumnFixing,
	DxFilterPanel,
	DxFilterBuilderPopup,
	DxLoadPanel,
	DxPopup,
	DxLookup,
	DxForm,
	DxToolbar,
	DxItem,
	DxHeaderFilter,
	DxFilterRow,
	DxSorting,
	DxColumn,
	DxScrolling,
	DxSelection,
} from 'devextreme-vue/data-grid';
import DashboardListEntity from '@/Types/Dashboard/DashboardListEntity';
import { RouteNames } from '@/Plugins/Router/RouteNames';
import notify from 'devextreme/ui/notify';
import { ref, watch, onMounted, onBeforeUnmount, onBeforeMount, computed } from 'vue';
import DialogFactory from '@/Classes/DialogueFactory';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import dxDataGrid from 'devextreme/ui/data_grid';
import { AxiosResponse } from 'axios';
import ButtonsGroupTemplate from '@/Views/Components/Datawarehouse/ButtonsGroupTemplate.vue';
import { ButtonType } from '@/Types/Datawarehouse/ButtonType';
import { IconClassEnum } from '@/Types/IconClassEnum';

const descriptionRef = ref(null);
const { t } = useI18n();
const buttons = ref<ButtonType[]>([
	{
		identifier: 'View',
		testIdPrefix: 'DASH-view',
		hint: t('View'),
		url: (e: any) => getUrlView(e),
		cssClasses: (e: any, identifier: any) => IconClassEnum.view,
		onClick: (e: any) => view(e),
	},
]);
const router = useRouter();
const store = useStore();
const route = useRoute();
const dataGrid = ref(null);
let count = ref(0);
let selectedRowsData = ref([]);
let dashboards = computed((): DashboardListEntity[] => store.getters['DashboardModule/items']());
const filterBuilderPopupPosition = {
	of: window,
	at: 'top',
	my: 'top',
	offset: { y: 10 },
};


async function init(): Promise<void> {
	getDataGrid()?.beginUpdate();
	await store
		.dispatch('DashboardModule/fetchAllByEnvironment')
		.then(() => { })
		.catch((error: any) => {
			notify(t('Dashboards.NotLoaded'), 'error', 6000);
			console.log('error while doshboards dispatching', error);
		});
	count.value++;
	getDataGrid()?.endUpdate();
}

function getDataGrid(): dxDataGrid | undefined {
	if (dataGrid.value === null || dataGrid.value === undefined) return undefined;
	return (dataGrid.value! as DxDataGrid).instance;
}



onMounted(() => {
	init();
	console.log("dashboards2", dashboards.value);
});

function view(e: any) {
	router.push({
		name: RouteNames.DashboardDetail,
		params: {
			id: e.row.key.toString(),
			mode: 'viewer',
		},
	});
}

function getUrlView(e: any): string {
	const url = router.resolve({
		name: RouteNames.DashboardDetail,

		params: {
			id: e.row.key.toString(),
			mode: 'viewer',
		},
	});
	return url.href;
}
</script>
