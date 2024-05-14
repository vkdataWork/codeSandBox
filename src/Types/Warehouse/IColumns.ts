export interface IColumns {
    columns: IColumnsView[];
    constraints: IPrimaryKey[];
}
export interface IColumnsView {
    __KEY__: string;
    id: string;
    name: string;
    dataType: string;
    length: string;
    allowLengthField: boolean;
    scale: string;
    allowScaleField: boolean;
    notNull: boolean;
    primaryKey: boolean;
    defaultValue: string;
    allowDefaultValueField: boolean;
    generalInherited: string;
    generalComment: string;
    definitionCollation: string;
    constraintsType: string;
    generatedExpresion: string;
    identityIdentity: boolean;
    identityIncrement: string;
    identityStart: string;
    identityMinimum: string;
    identityMaximum: string;
    identityCache: string;
    identityCycled: boolean;
    variableList: [
        {
            variablesName: string;
            variablesValue: string;
        },
    ];
    securityList: [
        {
            securityProvider: string;
            securityLabel: string;
        },
    ];
}

export interface IPrimaryKey {
    namePK: string;
    columns: string;
}

export interface IIdentity {
    identity: string;
    increment: string;
    start: string;
    minimum: string;
    maximum: string;
    cache: string;
    cycled: boolean;
}
