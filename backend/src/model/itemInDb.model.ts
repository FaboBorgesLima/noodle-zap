export class ItemInDb<T> {
    constructor(protected item: T, protected id: string) {}

    getItem(): T {
        return this.item;
    }

    getId(): string {
        return this.id;
    }
}
