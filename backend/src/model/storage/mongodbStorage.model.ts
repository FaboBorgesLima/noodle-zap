import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { HasJSON } from "../hasJson.interface";
import { CommonStorage } from "./commonStorage.model";
import { env } from "../../config/env";

export abstract class MongoDBStorage<
    Model extends HasJSON,
    Schema extends object
> extends CommonStorage<Model, ObjectId> {
    protected db: Db;
    protected abstract readonly COLLECTION_NAME: string;
    constructor(protected mongoClient: MongoClient) {
        super();
        this.db = this.mongoClient.db(env.MONGO_INITDB_DATABASE);
    }
    protected getCollection(): Collection<Schema> {
        return this.db.collection<Schema>(this.COLLECTION_NAME);
    }
}
