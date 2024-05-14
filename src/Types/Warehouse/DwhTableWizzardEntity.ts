import BaseEntity from '@/Types/Base/BaseEntity';
import { IColumns, IColumnsView, IIdentity, IPrimaryKey } from '@/Types/Warehouse/IColumns';
import { uuid } from '@/Utils/Utils';
import ColumnsViewEntity from './ColumnsViewEntity';
import PrimaryKeyEntity from './PrimaryKeyEntity';

export default class DwhTableWizzardEntity extends BaseEntity<string> implements IColumns {
	public id: string = '';
	type: string = '';
	name: string = '';
	owner: string = '';
	scheme: string = '';
	comment: string = '';
	code: string = '';
	columns: ColumnsViewEntity[] = [] as ColumnsViewEntity[];
	constraints: PrimaryKeyEntity[] = [] as PrimaryKeyEntity[];
	sqlFromApi?: string = '';
	public environmentId: number = 1;

	constructor(obj: any | undefined = undefined) {
		super();

		Object.assign(this, obj);
	}
}
