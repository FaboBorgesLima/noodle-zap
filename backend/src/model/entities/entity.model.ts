import { Primitive } from "../../@types/Primitive";
import { Schema } from "../../@types/Schema";
import { SchemaStorage } from "../storage/schemaStorage";

export abstract class Entity<SchemaT extends Schema> {
    constructor(
        protected storage: SchemaStorage<SchemaT>,
        public attributes: SchemaT,
        public id?: Primitive
    ) {
        //
    }

    public async save(): Promise<boolean> {
        if (this.id) {
            return this.storage.update(this.id, this.attributes);
        }

        const result = await this.storage.create(this.attributes);

        this.id = result;

        return true;
    }

    public async destroy(): Promise<boolean> {
        if (this.id) {
            return this.storage.delete(this.id);
        }

        return false;
    }

    public getStorage(): SchemaStorage<SchemaT> {
        return this.storage;
    }
}
