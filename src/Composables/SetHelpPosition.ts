export function setPosition(id: any, store: any): void {
	console.log('setPosition', id);
	store.commit('RightSideMenuModule/setPositionId', id);
}
