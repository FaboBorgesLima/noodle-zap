import { Primitive } from "./Primitive";
import { Schema } from "./Schema";

export interface WithId<SchemaT extends Schema> {
    id: Primitive;
    schema: SchemaT;
}
