import { Int32, ObjectId } from "mongodb";
import { MongodbUserSchema } from "./mongodbUser.schema";
export interface CommentSchema {
    _id: ObjectId;
    usr: MongodbUserSchema;
    text: string;
    dt: Date;
}
