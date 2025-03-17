import { CommentSchema } from "../../schema/comment.schema";
import { MongoDBStorage } from "./mongodbStorage";

export class CommentStorage extends MongoDBStorage<CommentSchema> {
    protected readonly COLLECTION_NAME: string = "comments";
}
