import { ActionContext, Store } from 'vuex';
import { TableInfo } from '@/Types/Warehouse/TableInfo';
import { ColumnInfo } from '@/Types/Warehouse/ColumnInfo';
import { TableData } from '@/Types/Warehouse/TableData';
import Axios from '@/Plugins/Axios';
import notify from 'devextreme/ui/notify';
import Vue from 'vue';
import { IntervalType } from '@/Types/IntervalType';
import AlertingEntity from '@/Types/Alerting/AlertingEntity';
import BaseModule from '@/Plugins/Store/BaseModule';
import DwhTableListEntity from '@/Types/Warehouse/DwhTableListEntity';
import DwhTableEntity from '@/Types/Warehouse/DwhTableEntity';

const baseModule = new BaseModule<number, DwhTableListEntity, DwhTableEntity>();

type StateType = {
	values: TableInfo[];
	columns: ColumnInfo[];
	data: TableData[];
	names: string[];
	dwhtable: DwhTableEntity;
	columnsKeys?: string[];
	schemas?: string[];
	owners?: any[];
};

export const WarehouseModule = {
	namespaced: true,

	state: {
		values: [],
		columns: [],
		data: [],
		names: [],
		dwhtable: {},
		schemas: [],
		owners: [],
	} as unknown as StateType,

	mutations: {
		setItem: baseModule.mutations.setItem,
		addItem: baseModule.mutations.addItem,
		deleteItem: baseModule.mutations.deleteItem,
		setAll: baseModule.mutations.setAll,
		
		loadValues: (state: StateType, value: TableInfo[]): void => {
			state.values.splice(0, state.values.length);
			state.values.push(...value);
		},
		loadColumns: (state: StateType, column: ColumnInfo[]): void => {
			state.columns.splice(0, state.columns.length);
			state.columns.push(...column);
		},
		loadData: (state: StateType, data: TableData[]): void => {
			state.data.splice(0, state.data.length);
			state.data.push(...data);
		},
		loadInterval: (state: StateType, data: IntervalType): void => {
			state.interval = data;
		},
		loadNames: (state: StateType, names: string[]): void => {
			state.names.splice(0, state.names.length);
			state.names.push(...names);
		},
		loadColumnsKeys: (state: StateType, data: string[]): void => {
			state.columnsKeys = new Array<string>();
			data.forEach((element) => {
				state.columnsKeys?.push(element);
			});
		},
		dwhtableload: (state: StateType, data: DwhTableEntity): void => {
			state.dwhtable = data;
		},
	},

	actions: {
		fetchAll: baseModule.actions.fetchAll,
		fetchItem: baseModule.actions.fetchItem,
		create: baseModule.actions.create,
		update: baseModule.actions.update,

		
		loadKeys: async (context: any, data: any): Promise<void> => {
			await Axios.get(
				`${context.getters['apiPath']}/key/1/${data.scheme}-${data.table}`,
			).then((response) => {
				context.commit('loadColumnsKeys', response.data);
			});
		},

		load: async (context: ActionContext<any, any>, value: TableInfo): Promise<void> => {
				Axios.get(`warehouse/1`).then((response) =>
					context.commit('loadValues', response.data),
				);
		},
		columnsload: async (context: ActionContext<any, any>, value: TableInfo): Promise<void> => {

			await Axios.get(`warehouse/1/${value.name}/${value.scheme}`).then((response) => {
				context.commit('loadColumns', response.data);
			});
		},
		columnsfromquery: async (context: ActionContext<any, any>, query: AlertingEntity): Promise<void> => {
			await Axios.post(`warehouse/query`, query).then((response) => context.commit('loadColumns', response.data));
		},
		namesfromquery: async (context: ActionContext<any, any>, query: AlertingEntity): Promise<void> => {
			await Axios.post(`warehouse/query/names`, query).then((response) => context.commit('loadNames', response.data));
		},
		datafromquery: async (context: ActionContext<any, any>, query: AlertingEntity): Promise<void> => {
			await Axios.post(`warehouse/query/data`, query).then((response) => context.commit('loadData', response.data));
		},

		dataload: async (context: ActionContext<any, any>, value: TableInfo): Promise<void> => {
			await Axios.get(`warehouse/data/1/${value.name}/${value.scheme}`).then((response) =>
				context.commit('loadData', response.data),
			);
		},
		nameload: async (context: ActionContext<any, any>, value: TableInfo): Promise<void> => {
			await Axios.get(`warehouse/names/1/${value.name}/${value.scheme}`).then((response) =>
				context.commit('loadNames', response.data),
			);
		},
		dwhtableload: async (context: ActionContext<any, any>, data: DwhTableEntity): Promise<void> => {
			await Axios.get(`dwhTable/1/${data.name}/${data.scheme}`).then((response) =>
				context.commit('dwhtableload', response.data),
			);
		},
	},

	getters: {
		...baseModule.getters,
		apiPath: () => 'warehouse',
		apiTablePath: () => 'dwhTable',
		listClass: () => DwhTableListEntity,
		class: () => DwhTableEntity,
		values: (state: StateType) => state.values,
		columns: (state: StateType) => state.columns,
		columnsname: (state: StateType) => state.names,
		data: (state: StateType) => state.data,
		dwhtable: (state: StateType) => state.dwhtable,
		keysColumn: (state: StateType) => state.columnsKeys,
	},
};

export default WarehouseModule;
