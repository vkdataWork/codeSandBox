import BaseEntity from '@/Types/Base/BaseEntity';
import { IColumns, IColumnsView, IIdentity, IPrimaryKey } from '@/Types/Warehouse/IColumns';
import { uuid } from '@/Utils/Utils';

const getUuid = () => uuid();
export default class ColumnsViewEntity extends BaseEntity<string> implements IColumnsView {
    __KEY__: string = '';
    id: any = getUuid();
    name: string = '';
    dataType: string = '';
    length: string = '';
    allowLengthField: boolean = false;
    scale: string = '';
    allowScaleField: boolean = false;
    notNull: boolean = false;
    primaryKey: boolean = false;
    defaultValue: string = '';
    allowDefaultValueField: boolean = false;
    generalInherited: string = '';
    generalComment: string = '';
    definitionCollation: string = '';
    constraintsType: string = '';
    generatedExpresion: string = '';
    identityIdentity: boolean = false;
    identityIncrement: string = '';
    identityStart: string = '';
    identityMinimum: string = '';
    identityMaximum: string = '';
    identityCache: string = '';
    identityCycled: boolean = false;
    variableList: [
        {
            variablesName: string;
            variablesValue: string;
        },
    ] = [
        {
            variablesName: '',
            variablesValue: '',
        },
    ];
    securityList: [
        {
            securityProvider: string;
            securityLabel: string;
        },
    ] = [
        {
            securityProvider: '',
            securityLabel: '',
        },
    ];

    constructor(obj: any | undefined = undefined) {
        super();

        Object.assign(this, obj);
    }
}
