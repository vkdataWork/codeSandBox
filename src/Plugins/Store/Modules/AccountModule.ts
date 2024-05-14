
import Axios from '@/Plugins/Axios';
import { env } from '@/envProvider';
import Store from '..';

type StateType = {
};

export const AccountModule = {
	namespaced: true,
	state: {
	} as StateType,

	mutations: {
		
	},

	actions: {
		
	},

	getters: {		
		urlWarehouseAPI: (state: StateType) => {
			return env('WAREHOUSE_API_URL');
		},
	},
};
export default AccountModule;
