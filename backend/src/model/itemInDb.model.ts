import { HasJSON } from "./hasJson.interface";

export class ItemInDb<T extends HasJSON> {
    constructor(protected item: T, protected id: string) {}

    getItem(): T {
        return this.item;
    }

    getId(): string {
        return this.id;
    }
    toJSON(): object {
        return { id: this.id, ...this.item.toJSON() };
    }
}
