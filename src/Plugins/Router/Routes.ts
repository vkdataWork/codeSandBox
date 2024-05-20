import { RouteNames } from "@/Plugins/Router/RouteNames";
import { RouteRecordRaw } from "vue-router";
import NoLayout from "@/Views/Layout/NoLayout.vue";
import WareHouseData from "@/Views/DataWarehouse/WareHouseData.vue";
import DashboardDetail from "@/Views/Dashboard/DashboardDetail.vue";

export const Routes = [
    {
        name: RouteNames.Default,
        path: "/:id?/:env?/:prj?/:time?/:scheme?/:table?",
        redirect: (to) => ({
            name: RouteNames.DashboardDetail,
            params: {
                id: 1,
                mode: "viewer",
            },
        }),
        children: [],
    } as RouteRecordRaw,

    {
        name: RouteNames.NotFound,
        path: "/:catchAll(.*)",
        redirect: (to) => ({ name: RouteNames.DashboardList, params: to.params }),
        children: [],
    } as RouteRecordRaw,

    {
        name: RouteNames.DataWarehouseData,
        path: "/data/:scheme/:table/:env?/:prj?/:time?",

        meta: {
            title: "Table data",
            section: RouteNames.Default,
            layout: NoLayout,
            parent: RouteNames.DataWarehouse,
            help: "",
        },
        component: WareHouseData,
    } as RouteRecordRaw,
    {
        name: RouteNames.DashboardDetail,
        path: "/dashboard/:mode/:id?/:reset_store?/:env?/:prj?/:set?/:time?",

        meta: {
            title: "Edit Dashboard",
            section: RouteNames.Default,
            layout: NoLayout,
            parent: RouteNames.DashboardList,
            help: "edit-dashboard",
        },
        component: DashboardDetail,
    } as RouteRecordRaw,
];
