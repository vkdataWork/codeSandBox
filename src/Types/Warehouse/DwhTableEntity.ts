import ProjectListEntity from "@/Types/Project/ProjectListEntity";
import BaseEntity from "@/Types/Base/BaseEntity";

export default class DwhTableEntity extends BaseEntity<number> {
    public id: number = 0;
    public name: string = '';
    public scheme: string = '';
    public environmentId: number = 1;
    public dwhTableTypeId: number = 1;
    public projects: ProjectListEntity[] = [];

    constructor(obj: any | undefined = undefined) {
        super();

        Object.assign(this, obj);
    }
}
