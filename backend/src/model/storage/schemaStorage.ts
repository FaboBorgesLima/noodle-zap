import { ConditionI } from "../../@types/ConditionI";
import { OperatorsT } from "../../@types/OperatorsT";
import { Primitive } from "../../@types/Primitive";
import { Schema } from "../../@types/Schema";
import { WithId } from "../../@types/WithId";

export abstract class SchemaStorage<SchemaT extends Schema> {
    public abstract update(id: Primitive, schema: SchemaT): Promise<boolean>;
    public abstract delete(id: Primitive): Promise<boolean>;
    public abstract create(schema: SchemaT): Promise<Primitive>;
    public abstract findById(id: Primitive): Promise<SchemaT | void>;
    public abstract all(): Promise<WithId<SchemaT>[]>;
    public abstract where(
        conditions: ConditionI<SchemaT>[]
    ): Promise<WithId<SchemaT>[]>;
    public abstract paginate(
        page: number,
        perPage: number
    ): Promise<WithId<SchemaT>[]>;
}
