import { PostSchema } from "../../schema/post.schema";
import { MongoDBStorage } from "./mongodbStorage";

export class PostStorage extends MongoDBStorage<PostSchema> {
    protected readonly COLLECTION_NAME = "posts";
}
