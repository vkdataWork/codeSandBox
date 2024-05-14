import BaseModule from '@/Plugins/Store/BaseModule';
import DashboardListEntity from '@/Types/Dashboard/DashboardListEntity';
import DashboardEntity from '@/Types/Dashboard/DashboardEntity';
import Axios from '@/Plugins/Axios';

const baseModule = new BaseModule<number, DashboardListEntity, DashboardEntity>();

export const DashboardModule = {
    namespaced: true,

    state: {
        ...baseModule.state,
        change: {} as DashboardEntity,
        file: {} as any,
    },

    mutations: {
        ...baseModule.mutations,       
},

    actions: {
        fetchAll: baseModule.actions.fetchAll,
        fetchItem: baseModule.actions.fetchItem,
        fetchAllByEnvironment: baseModule.actions.fetchAllByEnvironment,
        fetchAllNoProjects: baseModule.actions.fetchAllNoProjects,
       

        create: baseModule.actions.create,
        update: baseModule.actions.update,
        delete: baseModule.actions.delete,

       
        change: async ({ getters, rootGetters }: { getters: any; rootGetters: any }, item: DashboardListEntity): Promise<void> => {
            await Axios.put(`${getters['apiPath']}`, item);
        },
        export: async (context: any, id: number): Promise<void> => {
            await Axios.get(`${context.getters['apiPath']}/export/${id}`, { responseType: 'json' }).then((response) => {
                context.commit('setFile', response.data);
            });
        },
    },

    getters: {
        ...baseModule.getters,
        apiPath: () => 'dashboards',
        listClass: () => DashboardListEntity,
        class: () => DashboardEntity,
        file: (state: any) => state.file
    },
};

export default DashboardModule;
