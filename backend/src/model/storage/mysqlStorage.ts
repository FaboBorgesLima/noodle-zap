import { SchemaStorage } from "./schemaStorage";
import { Schema } from "../../@types/Schema";
import { Primitive } from "../../@types/Primitive";
import { WithId } from "../../@types/WithId";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { ConditionI } from "../../@types/ConditionI";

export abstract class MysqlStorage<
    SchemaT extends Schema
> extends SchemaStorage<SchemaT> {
    protected abstract readonly TABLE_NAME: string;

    constructor(protected pool: Connection) {
        super();
    }

    public async create(schema: SchemaT): Promise<Primitive> {
        const [result] = await this.pool.query<ResultSetHeader>(
            `INSERT INTO ${this.TABLE_NAME} (${Object.keys(schema).join(
                ","
            )}) VALUES (${Object.keys(schema)
                .map((col) => `:${col}`)
                .join(" , ")})`,
            schema
        );

        return result.insertId;
    }

    public async update(id: Primitive, schema: SchemaT): Promise<boolean> {
        await this.pool.query<ResultSetHeader>(
            `UPDATE ${this.TABLE_NAME} SET ${Object.keys(schema)
                .map((col) => `${col} = :${col}`)
                .join(",")} WHERE id = :id`,
            { ...schema, id }
        );

        return true;
    }

    public async delete(id: Primitive): Promise<boolean> {
        const [result] = await this.pool.query<ResultSetHeader>(
            `DELETE FROM ${this.TABLE_NAME} WHERE id=:id`,
            { id }
        );
        return Boolean(result.affectedRows);
    }

    public async findById(id: Primitive): Promise<SchemaT | void> {
        const [result] = await this.pool.query<SchemaT & RowDataPacket[]>(
            `SELECT * FROM ${this.TABLE_NAME} WHERE id=:id`,
            { id }
        );
        if (!result.length) return;

        const [schema] = result;

        return <SchemaT>schema;
    }

    public async all(): Promise<WithId<SchemaT>[]> {
        const [result] = await this.pool.query<SchemaT & RowDataPacket[]>(
            `SELECT * FROM ${this.TABLE_NAME}`
        );

        return result.map((row) => {
            return { schema: <SchemaT>row, id: row.id };
        });
    }

    public async where(
        conditions: ConditionI<SchemaT, keyof SchemaT>[]
    ): Promise<WithId<SchemaT>[]> {
        const values: { [k: string]: any } = {};

        for (const item of conditions) {
            values[String(item.col)] = item.value;
        }

        const [result] = await this.pool.query<SchemaT & RowDataPacket[]>(
            `SELECT * FROM ${this.TABLE_NAME} WHERE ${conditions.map(
                (condition) =>
                    `${String(condition.col)} ${condition.operator} :${String(
                        condition.col
                    )}`
            )}`,
            values
        );

        return result.map((row) => {
            return { schema: <SchemaT>row, id: row.id };
        });
    }

    public async paginate(
        page: number,
        perPage: number
    ): Promise<WithId<SchemaT>[]> {
        const [result] = await this.pool.query<SchemaT & RowDataPacket[]>(
            `SELECT * FROM ${this.TABLE_NAME} OFFSET :offset LIMIT :limit`,
            {
                limit: perPage,
                offset: perPage * page,
            }
        );

        return result.map((row) => {
            return { schema: <SchemaT>row, id: row.id };
        });
    }
}
