import {
    Collection,
    Db,
    Filter,
    MongoClient,
    ObjectId,
    OptionalUnlessRequiredId,
} from "mongodb";
import { env } from "../../config/env";
import { SchemaStorage } from "./schemaStorage";
import { Schema } from "../../@types/Schema";
import { Primitive } from "../../@types/Primitive";
import { WithId } from "../../@types/WithId";
import { OperatorsT } from "../../@types/OperatorsT";
import { ConditionI } from "../../@types/ConditionI";

export abstract class MongoDBStorage<
    SchemaT extends Schema
> extends SchemaStorage<SchemaT> {
    protected db: Db;
    protected abstract readonly COLLECTION_NAME: string;
    constructor(protected mongoClient: MongoClient) {
        super();
        this.db = this.mongoClient.db(env.MONGO_INITDB_DATABASE);
    }

    public getCollection(): Collection<SchemaT> {
        return this.db.collection<SchemaT>(this.COLLECTION_NAME);
    }

    public async create(schema: SchemaT): Promise<Primitive> {
        const result = await this.getCollection().insertOne(<
            OptionalUnlessRequiredId<SchemaT>
        >{ ...schema, _id: new ObjectId() });

        return result.insertedId.toHexString();
    }

    public async update(id: Primitive, schema: SchemaT): Promise<boolean> {
        const result = await this.getCollection().replaceOne(
            // @ts-ignore
            { _id: ObjectId.createFromHexString(id.toString()) },
            schema
        );

        return Boolean(result.matchedCount);
    }

    public async delete(id: Primitive): Promise<boolean> {
        //@ts-ignore
        const result = await this.getCollection().deleteOne({
            _id: ObjectId.createFromHexString(id.toString()),
        });

        return Boolean(result.deletedCount);
    }

    public async findById(id: Primitive): Promise<SchemaT | void> {
        //@ts-ignore
        const result: SchemaT | null = await this.getCollection().findOne({
            _id: ObjectId.createFromHexString(id.toString()),
        });

        if (result) {
            return result;
        }
    }

    public async all(): Promise<WithId<SchemaT>[]> {
        return await this.getCollection()
            .find()
            .map((doc): WithId<SchemaT> => {
                // @ts-ignore
                return { id: doc._id.toHexString(), schema: doc };
            })
            .toArray();
    }

    public async where(
        conditions: ConditionI<SchemaT>[]
    ): Promise<WithId<SchemaT>[]> {
        const query: Filter<SchemaT> = {};

        for (const condition of conditions) {
            //@ts-ignore
            query[condition.col] = MongoDBStorage.operatorValueToObject(
                condition.operator,
                condition.value
            );
        }

        //@ts-ignore
        return (await this.getCollection().find(query).toArray()).map(
            (entity) => {
                return { id: entity._id.toHexString(), schema: entity };
            }
        );
    }

    private static operatorValueToObject<T>(operator: OperatorsT, value: T) {
        switch (operator) {
            case "=":
                return { $eq: value };
            case "<":
                return { $lt: value };
            case ">":
                return { $gt: value };
            case "!=":
                return { $ne: value };
            case ">=":
                return { $gte: value };
            case "<=":
                return { $lte: value };
        }
    }

    public async paginate(
        page: number,
        perPage: number
    ): Promise<WithId<SchemaT>[]> {
        //@ts-ignore
        return await this.getCollection()
            .find({})
            .skip(page * perPage)
            .limit(perPage)
            .map((entity) => {
                return { id: entity._id.toHexString(), schema: entity };
            })
            .toArray();
    }
}
