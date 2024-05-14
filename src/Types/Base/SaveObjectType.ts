export type SaveObjectType<TKey> = {
    id: TKey;
    [property: string]: any;
}