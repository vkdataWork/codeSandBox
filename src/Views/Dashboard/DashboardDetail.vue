<template>
    <div>
        <div :key="showGetDasboardStateButton">
            <action-bar v-if="actionBarMenu.getState != null" :menuItems="actionBarMenu"
                @actionBarEvent="handleActionBarEvent" />
        </div>
    </div>
    <DxDashboardControl ref="dashboard" class="responsive-paddings" :endpoint="apiUrl" style="height: 90dvh"
        :workingMode="workingModeProp" :dashboardId="selectedDashboard" :loadDefaultDashboard="false"
        limitVisibleDataMode="DesignerAndViewer" :allowExecutingCustomSql="true" :onBeforeRender="onBeforeRender"
        :showConfirmationOnBrowserClosing="true" :onDashboardInitialized="onDashboardInitialized"
        :onDashboardEndUpdate="(e: any) => onDashboardEndUpdate(e)"
        :default-extensions="[DxExtensions.DataSourceWizard]" :extensions="[
            DxExtensions.DataSourceWizard,
            DxExtensions.DashboardParameterDialog,
            DxExtensions.ItemOptionsPanel,
            DxExtensions.DataInspector,
            DxExtensions.ChartIndicators,
            DxExtensions.Toolbar,
            DxExtensions.DesignerToolbar,
            DxExtensions.HierarchyEditor,
            DxExtensions.CustomItemExtension,
            DxExtensions.GanttItemExtension,
            DxExtensions.FunnelD3ItemExtension,
            DxExtensions.TreeViewItemExtension,
            DxExtensions.OnlineMapItemExtension,
            DxExtensions.ParameterItemExtension,
            DxExtensions.PolarChartItemExtension,
            DxExtensions.SimpleTableItemExtension,
            DxExtensions.WebPageItemExtension,
            DxExtensions.ExportDashboard,
        ]">
        <DxExtensions :enableCustomSql="true">
            <DxChartIndicators />
            <DxDataInspector :allowInspectAggregatedData="true" :allowInspectRawData="true" />
            <DxDashboardParameterDialog :allowParameterEditing="true" :allowParameterAdding="true"
                :allowParameterDeleting="true" :allowParameterTypes="[
                    'System.String',
                    'System.DateTime',
                    'System.Int32',
                    'System.Int64',
                    'System.Double',
                    'System.Boolean',
                ]" />
            <DxDataSourceWizard :wizardSettings="{
                enableOlapDataSource: true,
                enableJsonDataSource: true,
            }" :enableCustomSql="true" :allowCreateNewJsonConnection="true" />
        </DxExtensions>
    </DxDashboardControl>
</template>

<script setup lang="ts">
import {
    DxExtensions,
    DxDataInspector,
    DxChartIndicators,
    DxDataSourceWizard,
    DxDashboardParameterDialog,
} from "devexpress-dashboard-vue/dashboard-control";
import { DxDashboardControl } from "devexpress-dashboard-vue";
import ActionBar from "@/Views/Commons/ActionBar.vue";
import { ActionBarMenuType } from "@/Types/ActionBarMenuType";
import DashboardEntity from "@/Types/Dashboard/DashboardEntity";
import { computed, ref, onBeforeUnmount, onBeforeMount, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { TextBoxItemEditorExtension } from "devexpress-dashboard/designer/text-box-item-editor-extension";
import { ChartIndicatorsExtension } from "devexpress-dashboard/designer";
import "ace-builds/css/ace.css";
import "devexpress-richedit/dist/dx.richedit.css";
import "@devexpress/analytics-core/dist/css/dx-analytics.common.css";
import "@devexpress/analytics-core/dist/css/dx-querybuilder.css";
import "devextreme/dist/css/dx.common.css";
import { GanttItemExtension } from "@/Views/Components/Dashboard/extensions/gantt-item";
import { TreeViewItemExtension } from "@/Views/Components/Dashboard/extensions/hierarchical-tree-view-item";
import { OnlineMapItemExtension } from "@/Views/Components/Dashboard/extensions/online-map-item/online-map-item";
import { ParameterItemExtension } from "@/Views/Components/Dashboard/extensions/parameter-item/parameter-item";
import { PolarChartItemExtension } from "@/Views/Components/Dashboard/extensions/polar-chart-item/polar-chart-item";
import { SimpleTableItemExtension } from "@/Views/Components/Dashboard/extensions/simple-table/simple-table-item";
import { WebPageItemExtension } from "@/Views/Components/Dashboard/extensions/webpage-item/webpage-item";
import { TreeListItemExtension } from "@/Views/Components/Dashboard/extensions/tree-list/tree-list-item";
import { FunnelD3ItemExtension } from "@/Views/Components/Dashboard/extensions/funnel-d3-item/funnel-d3-item";
import { SchedulerExtension } from "@/Views/Components/Dashboard/extensions/scheduler-item/scheduler-item";
import { RouteNames } from "@/Plugins/Router/RouteNames";
import axios, { AxiosResponse } from "axios";

const store = useStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const apiState = axios.create({
    baseURL: store.getters["AccountModule/urlWarehouseAPI"],
    headers: {
        "Content-Type": "application/json",
    },
});
let refreshInterval;
apiState.interceptors.request.use(
    (config) => {
        config.baseURL = store.getters["AccountModule/urlWarehouseAPI"];
        return config;
    },
    (error) => {
        // router.push({ name: RouteNames.Login });
        console.log("interceptor error axios data", error);
        return Promise.reject(error);
    }
);

const workingModeProp = ref<string>(route.params.mode === "designer" ? "Designer" : "Viewer");
let showGetDasboardStateButton = ref(0);
let actionBarMenu: ActionBarMenuType = {
    back: route.params.mode === "pureviewer" ? false : true,
    getState: workingModeProp.value != "Designer" ? true : false,
    setState: workingModeProp.value != "Designer" ? true : false,
    removeState: workingModeProp.value != "Designer" ? true : false,
    initialState: workingModeProp.value != "Designer" ? true : false,
    view: workingModeProp.value != "Designer" ? false : true,
    edit: workingModeProp.value != "Designer" ? true : false,
    refresh: workingModeProp.value != "Designer" ? true : false,
    interval: workingModeProp.value != "Designer" ? true : false,
};
const selectedDashboard = ref<string | null>(null);
const currentEnvironment = ref<number>(1);
const pageTitle = ref<string>(workingModeProp.value === "Designer" ? "Designer mode" : "Viewer mode");
const dashboard = ref(null);
let dashboardControl = ref<any>();
let dashboardEntity = computed<DashboardEntity>(() => {
    return store.getters["DashboardModule/item"]();
});
let registrationCount = ref<number>(0);

onBeforeMount(() => {

    workingModeProp.value =
        route.params.mode === "designer" || route.params.mode == "designercopy" ? "Designer" : "Viewer";
    pageTitle.value = ` ${workingModeProp.value === "Designer" ? "Designer mode" : "Viewer mode"}`;
    if (route.params.mode === "designercopy") {
        store.dispatch("DashboardModule/fetchItemCopy", Number(route.params.id));
    }

    if (route.params.id == undefined || route.params.id == "") {
        //selectedDashboard.value = '0';
        //getDashboardControl()!.selectedDashboard = '0';
    } else {
        store.dispatch("DashboardModule/fetchItem", Number(route.params.id)).then(() => {
            getDashboardControl()!.selectedDashboard = route.params.id;
            selectedDashboard.value = String(route.params.id);
        });
    }
});

onBeforeUnmount(async () => {
    clearInterval(refreshInterval);
});
onUnmounted(async () => { });

function onDashboardInitialized() {
    if (dashboardControl.value != undefined) {
        dashboardControl.value.setDashboardState(
            JSON.stringify({
                Parameters: route.query,
            })
        );
    }
}

function onDashboardEndUpdate(e: any) { }

function getDashboardControl(): any {
    if (dashboard.value == null || dashboard.value == undefined) {
        return null;
    }
    return (dashboard.value as any).instance;
}

function registerExtension(e: any) {
    if (e.component != undefined) {
        registrationCount.value++;
        if (registrationCount.value > 1) {
            return;
        }
        e.component.registerExtension(new TextBoxItemEditorExtension(e.component));
        console.log("register", e.component);
        e.component.registerExtension(
            new ChartIndicatorsExtension(e.component, {
                customIndicatorTypes: [
                    {
                        type: "MovingIndicator",
                        displayName: "trend indicator",
                    },
                ],
            }),
            new FunnelD3ItemExtension(e.component),
            new GanttItemExtension(e.component),
            new OnlineMapItemExtension(e.component),
            new ParameterItemExtension(e.component),
            new PolarChartItemExtension(e.component),
            new SimpleTableItemExtension(e.component),
            new WebPageItemExtension(e.component),
            new TreeListItemExtension(e.component),
            new SchedulerExtension(e.component)
        );
    }
}

async function onBeforeRender(e: any) {
    dashboardControl.value = e.component;
    dashboardControl.value.remoteService.headers = {};
    currentEnvironment.value = 1;
    registerExtension(e);
}

const apiUrl = ref<string>(`${store.getters["AccountModule/urlWarehouseAPI"]}/api/dashboard`);
const apiStateUrl = ref<string>(`${store.getters["AccountModule/urlWarehouseAPI"]}/dashboards`);

function handleActionBarEvent(e: any) {
    if (e.itemData.nameId === "view") {
        actionBarMenu.view = !actionBarMenu.view;
        actionBarMenu.edit = !actionBarMenu.edit;
        actionBarMenu.interval = !actionBarMenu.interval;
        actionBarMenu.refresh = !actionBarMenu.refresh;
        workingModeProp.value = "Viewer";
        showGetDasboardStateButton.value++;
    }
    if (e.itemData.nameId === "edit") {
        actionBarMenu.view = !actionBarMenu.view;
        actionBarMenu.edit = !actionBarMenu.edit;
        actionBarMenu.interval = !actionBarMenu.interval;
        actionBarMenu.refresh = !actionBarMenu.refresh;
        workingModeProp.value = "Designer";
        showGetDasboardStateButton.value++;
    }
    if (e.itemData.nameId === "switch") {
        onClick();
    }
    if (e.itemData.nameId === "refresh") {
        dashboardControl.value.refresh();
    }
}

function onClick() {
    workingModeProp.value = workingModeProp.value === "Designer" ? "Viewer" : "Designer";
    pageTitle.value = ` ${workingModeProp.value === "Designer" ? "Designer mode" : "Viewer mode"}`;
    actionBarMenu = {
        ...actionBarMenu,
        getState: workingModeProp.value != "Designer" ? true : false,
        setState: workingModeProp.value != "Designer" ? true : false,
        removeState: workingModeProp.value != "Designer" ? true : false,
        initialState: workingModeProp.value != "Designer" ? true : false,
    };
}
</script>

<style>
.dx-toolbar-before {
    padding-left: 1dvw !important;
}
</style>
