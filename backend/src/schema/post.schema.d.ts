import { Int32, ObjectId } from "mongodb";
import { CommentSchema } from "./comment.schema";
import { MongodbUserSchema } from "./mongodbUser.schema";
import { LikeSchema } from "./like.schema";

export interface PostSchema {
    usr: MongodbUserSchema;
    title: string;
    text: string;
    comments: CommentSchema[];
    likes: LikeSchema[];
    dt: Date;
}
