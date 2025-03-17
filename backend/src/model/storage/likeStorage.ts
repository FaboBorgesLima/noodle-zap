import { LikeSchema } from "../../schema/like.schema";
import { MongoDBStorage } from "./mongodbStorage";

export class LikeStorage extends MongoDBStorage<LikeSchema> {
    protected readonly COLLECTION_NAME: string = "likes";
}
