import { OperatorsT } from "./OperatorsT";
import { Schema } from "./Schema";

export interface ConditionI<
    SchemaT extends Schema,
    ColT extends keyof SchemaT = keyof SchemaT
> {
    col: ColT;
    operator: OperatorsT;
    value: SchemaT[ColT];
}
