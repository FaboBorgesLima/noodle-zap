import { ConditionI } from "../../@types/ConditionI";
import { Primitive } from "../../@types/Primitive";
import { Schema } from "../../@types/Schema";
import { WithId } from "../../@types/WithId";
import { Entity } from "../entities/entity.model";
import { SchemaStorage } from "../storage/schemaStorage";

export abstract class EntityFactory<
    EntityT extends Entity<SchemaT>,
    SchemaT extends Schema = EntityT["attributes"]
> {
    public constructor(
        protected schemaStorage: SchemaStorage<SchemaT>,
        protected Entity: new (
            storage: SchemaStorage<SchemaT>,
            attributes: SchemaT,
            id?: Primitive
        ) => EntityT
    ) {
        //
    }

    public async findById(id: Primitive): Promise<EntityT | void> {
        const schema = await this.schemaStorage.findById(id);
        if (!schema) {
            return;
        }

        return this.factory({ schema, id: id });
    }

    public async where(
        conditions: ConditionI<EntityT["attributes"]>[]
    ): Promise<EntityT[]> {
        return (await this.schemaStorage.where(conditions)).map(
            this.factory.bind(this)
        );
    }

    public async paginate(page: number, perPage: number): Promise<EntityT[]> {
        return (await this.schemaStorage.paginate(page, perPage)).map(
            this.factory.bind(this)
        );
    }

    public async all(): Promise<EntityT[]> {
        return (await this.schemaStorage.all()).map(this.factory.bind(this));
    }

    public abstract getDefault(): EntityT["attributes"];

    public factory(): EntityT;
    public factory(schema: SchemaT): EntityT;
    public factory(schema: WithId<SchemaT>): EntityT;
    public factory(schema?: WithId<SchemaT> | SchemaT): EntityT {
        if (schema && "id" in schema) {
            return new this.Entity(
                this.schemaStorage,
                schema.schema,
                schema.id
            );
        }

        return new this.Entity(
            this.schemaStorage,
            schema ? schema : this.getDefault()
        );
    }
}
