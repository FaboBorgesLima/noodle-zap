import { Int32 } from "mongodb";
import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";

export class ItemInDbInt32<T extends HasJSON> extends ItemInDb<T, Int32> {
    getId(): string {
        return this.id.toString();
    }

    constructor(item: T, id: Int32) {
        super(item, id);
    }
}
