import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";

export class ItemInDbNumber<T extends HasJSON> extends ItemInDb<T, number> {
    getId(): string {
        return this.id.toString();
    }
    constructor(item: T, id: number) {
        super(item, id);
    }
}
