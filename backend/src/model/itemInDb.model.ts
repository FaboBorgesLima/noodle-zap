import { HasJSON } from "./hasJson.interface";

export abstract class ItemInDb<T extends HasJSON, Id extends any = unknown> {
    constructor(protected item: T, protected id: Id) {}

    getItem(): T {
        return this.item;
    }

    getRawId(): Id {
        return this.id;
    }

    abstract getId(): string;

    toJSON(): object {
        return { id: this.getId(), ...this.item.toJSON() };
    }
}
