export function getTitle(isCreate: boolean, routeTitle: string, routeName: string, name: string, id: any) {
	let result = isCreate ? `${routeName} - ${routeTitle}` : `${routeName} : ${id==null ||id==''? '':id} ${id==null || id==''? '':'-'} ${name}`;
	return result;
}

export function getTableTitle(isCreate: boolean, routeTitle: string, routeName: string, tableName: string, scheme: any) {
	let result = isCreate ? `${routeName} - ${routeTitle}` : `${routeName} : ${scheme}.${tableName}`;
	return result;
}
