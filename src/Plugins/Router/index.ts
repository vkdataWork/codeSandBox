import { Routes } from '@/Plugins/Router/Routes';
import { createRouter, createWebHistory } from 'vue-router';
import { RouteLocationNormalized } from 'vue-router';
import store from '@/Plugins/Store';

export default createRouter({
	routes: applyRoutes(Routes),
	history: createWebHistory(),
});
async function beforeEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: any): Promise<void> {
		if (!to.params.reset_store || to.params.reset_store === 'true') {
		await store.dispatch('resetAll');
	}

	const canLoad = true;
	if (canLoad) {
		next();
	} else {
		next(Routes.find((x) => <string>x.name === 'RoutesNames.Default'));
	};
}

function applyRoutes(routes: any[]): any[] {
	return routes.map((x) => {
		x.beforeEnter = beforeEnter;
		return x;
	});
}
