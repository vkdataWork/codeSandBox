import IEntity from "@/Types/Base/IEntity";
import ProjectListEntity from "@/Types/Project/ProjectListEntity";

export default class DwhTableListEntity implements IEntity<number> {
    public id: number = 0;
    public name: string = '';
    public scheme: string = '';
    public environmentId: number = 1;
    public dwhTableTypeId: number = 1;
    public projects: ProjectListEntity[] = [];

    constructor(obj: any | undefined = undefined) {
        Object.assign(this, obj);
    }
}
