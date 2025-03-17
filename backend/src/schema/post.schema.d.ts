import { Int32, ObjectId, WithId } from "mongodb";
import { CommentSchema } from "./comment.schema";
import { MongodbUserSchema } from "./mongodbUser.schema";
import { LikeSchema } from "./like.schema";

export interface PostSchema {
    usr: MongodbUserSchema;
    title: string;
    text: string;
    comments: WithId<CommentSchema>[];
    likes: WithId<LikeSchema>[];
    dt: Date;
}
