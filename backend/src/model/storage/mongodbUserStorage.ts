import { MongodbUserSchema } from "../../schema/mongodbUser.schema";
import { MongoDBStorage } from "./mongodbStorage";

export class MongodbUserStorage extends MongoDBStorage<MongodbUserSchema> {
    protected readonly COLLECTION_NAME = "users";
}
