import { Int32, ObjectId } from "mongodb";
import { MongodbUserSchema } from "./mongodbUser.schema";
export interface CommentSchema {
    usr: MongodbUserSchema;
    text: string;
    dt: Date;
    post: ObjectId;
}
