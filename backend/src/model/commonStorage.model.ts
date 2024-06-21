import { ItemInDb } from "./itemInDb.model";

export abstract class CommonStorage<T> {
    abstract create(item: T): Promise<ItemInDb<T> | void>;

    abstract update(itemInDb: ItemInDb<T>): Promise<ItemInDb<T> | void>;

    abstract delete(id: string): Promise<boolean>;

    abstract getById(id: string): Promise<ItemInDb<T> | void>;
}
