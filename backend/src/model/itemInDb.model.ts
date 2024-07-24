import { ObjectId } from "mongodb";
import { HasJSON } from "./hasJson.interface";

export class ItemInDb<T extends HasJSON> {
    constructor(protected item: T, protected id: string) {}

    getItem(): T {
        return this.item;
    }

    getId(): string {
        return this.id;
    }

    static fromObjectId<T extends HasJSON>(item: T, id: ObjectId): ItemInDb<T> {
        return new ItemInDb(item, id.toHexString());
    }

    toJSON(): object {
        return { id: this.id, ...this.item.toJSON() };
    }
}
