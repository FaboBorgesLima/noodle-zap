import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";

export abstract class CommonStorage<T extends HasJSON, Id> {
    abstract create(item: T): Promise<ItemInDb<T, Id> | void>;

    abstract update(itemInDb: ItemInDb<T, Id>): Promise<ItemInDb<T, Id> | void>;

    abstract delete(id: Id): Promise<boolean>;

    abstract getById(id: Id): Promise<ItemInDb<T, Id> | void>;
}
