import { createStore } from 'vuex';
import StatusModule from './Modules/StatusModule';
import { RESET } from '@/Plugins/Store/BaseModule';
import AccountModule from '@/Plugins/Store/Modules/AccountModule';
import WarehouseModule from '@/Plugins/Store/Modules/WarehouseModule';
import DashboardModule from '@/Plugins/Store/Modules/DashboardModule';

const modules = {
	WarehouseModule: WarehouseModule,
	DashboardModule: DashboardModule,
	AccountModule:AccountModule
} as any;

type DefaultState = {
	url: string;
	disableReset: boolean;
};

export default createStore({
	state: {
		url: '',
		disableReset: false,
	} as DefaultState,

	mutations: {
		setUrl(state: DefaultState, item: string): void {
			state.url = item;
		},

		setDisableReset(state: DefaultState, item: boolean): void {
			state.disableReset = item;
		},
	},

	actions: {
		setUrl(context: any, param: string): void {
			context.commit('setUrl', param);
		},

		setDisableReset(context: any, param: boolean): void {
			context.commit('setDisableReset', param);
		},

		resetAll(context: any): void {
			if (context.state.disableReset) {
				return;
			}

			for (const module in modules) {
				if (modules[module].mutations[RESET]) {
					context.commit(`${module}/${RESET}`);
					if (modules[module].modules) {
						for (const nestedModule in modules[module].modules) {
							if (modules[module].modules[nestedModule].mutations[RESET]) {
								context.commit(`${module}/${nestedModule}/${RESET}`);
							}
						}
					}
				}
			}
		},
	},
	modules: modules,
	devtools:true,
	getters: {
		url(state: DefaultState): string {
			return state.url;
		},
	},
});
