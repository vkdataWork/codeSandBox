//import BaseEntity from "@/Types/Base/BaseEntity";

export type ColumnInfo = {
    id: number;
    name: string;
    type: string;
    nullable: boolean;
}

/*
export default class ColumnInfo extends BaseEntity<number> {
    public id: number = 0;
    public name: string = '';
    public type: string = '';

    constructor(obj: any | undefined = undefined) {
        super();

        Object.assign(this, obj);
    }*/
//}
