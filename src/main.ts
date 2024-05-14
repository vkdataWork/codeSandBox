import { createApp, ref } from 'vue';
import App from '@/App.vue';
import router from '@/Plugins/Router';
import '@/Themes/generated/theme.additional.css';
import i18n from '@/Plugins/I18n';
import store from '@/Plugins/Store';
import 'devextreme/dist/css/dx.common.css';
import 'ace-builds/css/ace.css';
import 'devexpress-richedit/dist/dx.richedit.css';
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css';
import '@devexpress/analytics-core/dist/css/dx-querybuilder.css';
import {baseAxios as axios} from '@/Plugins/Axios';
import { AxiosError, AxiosResponse } from 'axios';
import { setupWorker } from 'msw/browser'
import { handlers } from '@/Plugins/Mocks/Handlers';
import { env } from '@/envProvider';

export const worker = setupWorker(...handlers)
const app = createApp(App);

(async () => {	
	app.use(store);
	axios.defaults.baseURL = store.getters['AccountModule/urlWarehouseAPI'];
	axios.interceptors.request.use(
		(request)=>{
			return request;
		}
	)
	axios.interceptors.response.use(
		(response: AxiosResponse) => {
			return response;
		},
		(error: AxiosError) => {
			return Promise.reject(error);
		},
	)
	app.use(router);
	app.use(i18n);
	await prepareApp().then(()=>{app.mount('#app')});
})();

async function prepareApp() {  
     await worker.start();
	
}
