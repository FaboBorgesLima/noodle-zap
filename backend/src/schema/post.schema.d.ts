import { Int32, ObjectId } from "mongodb";
import { CommentSchema } from "./comment.schema";

export interface PostSchema {
    _id: ObjectId;
    usr: {
        id: Int32;
        name: string;
    };
    title: string;
    text: string;
    comments: CommentSchema[];
}
