import { RouteNames } from '@/Plugins/Router/RouteNames';
import { RouteRecordRaw } from 'vue-router';
import NoLayout from '@/Views/Layout/NoLayout.vue';

import DataWareHouse from '@/Views/DataWarehouse/DataWareHouse.vue';
import WareHouseData from '@/Views/DataWarehouse/WareHouseData.vue';
import DashboardList from '@/Views/Dashboard/DashboardList.vue';
import DashboardDetail from '@/Views/Dashboard/DashboardDetail.vue';

export const Routes = [
	{
		name: RouteNames.Default,
		path: '/:env?/:prj?/:time?',
		redirect: (to) => ({ name: RouteNames.DashboardList, params: to.params }),
		children: [],
	} as RouteRecordRaw,

	{
		name: RouteNames.NotFound,
		path: '/:catchAll(.*)',
		redirect: (to) => ({ name: RouteNames.DashboardList, params: to.params }),
		children: [],
	} as RouteRecordRaw,

	{
		name: RouteNames.DataWarehouse,
		path: '/data-warehouse/:env?/:prj?/:time?',

		meta: {
			title: 'Tables & Views',
			section: RouteNames.Default,
			layout: NoLayout,
			parent: RouteNames.DataWarehouse,
			help: 'list-table',
		},
		component: DataWareHouse,
	} as RouteRecordRaw,
	
	{
		name: RouteNames.DataWarehouseData,
		path: '/data/:scheme/:table/:env?/:prj?/:time?',

		meta: {
			title: 'Table data',
			section: RouteNames.Default,
			layout: NoLayout,
			parent: RouteNames.DataWarehouse,
			help: '',
		},
		component: WareHouseData,
	} as RouteRecordRaw,
	
	{
		name: RouteNames.DashboardList,
		path: '/dashboards/:time?/:env?/:prj?',

		meta: {
			title: 'Dashboards',
			section: RouteNames.Default,
			layout: NoLayout,
			parent: RouteNames.DashboardList,
			help: 'list-dashboard',
		},
		component: DashboardList,
	} as RouteRecordRaw,
	{
		name: RouteNames.DashboardDetail,
		path: '/dashboard/:mode/:id?/:reset_store?/:env?/:prj?/:set?/:time?',

		meta: {
			title: 'Edit Dashboard',
			section: RouteNames.Default,
			layout: NoLayout,
			parent: RouteNames.DashboardList,
			help: 'edit-dashboard',
		},
		component: DashboardDetail,
	} as RouteRecordRaw,
];
