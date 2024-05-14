import BaseEntity from '@/Types/Base/BaseEntity';
import { IColumns, IColumnsView, IIdentity, IPrimaryKey } from '@/Types/Warehouse/IColumns';
import { uuid } from '@/Utils/Utils';

const getUuid = () => uuid();
export default class PrimaryKeyEntity extends BaseEntity<string> implements IPrimaryKey {
    public id: any = getUuid();
    namePK: string = '';
    columns: string = '';

    constructor(obj: any | undefined = undefined) {
        super();

        Object.assign(this, obj);
    }
}
