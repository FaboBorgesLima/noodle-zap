import { ObjectId } from "mongodb";
import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";

export class ItemInDbObjectId<T extends HasJSON> extends ItemInDb<T, ObjectId> {
    constructor(item: T, id: ObjectId) {
        super(item, id);
    }
    getId(): string {
        return this.id.toHexString();
    }
}
