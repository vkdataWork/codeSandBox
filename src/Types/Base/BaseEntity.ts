import IEntity from "@/Types/Base/IEntity";
import {SaveObjectType} from "@/Types/Base/SaveObjectType";
import {cloneDeep} from "lodash";

export default abstract class BaseEntity<TKey> implements IEntity<TKey> {
    public abstract id: TKey;

    public clone<T>(this: T): T {
        return cloneDeep(this);
    }

    public toSaveObject(): SaveObjectType<TKey> {
        return this.clone();
    }
}
