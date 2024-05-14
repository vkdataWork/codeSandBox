export type BaseStateType<TList, T> = {
    items: TList[];
    item: T | null;
};