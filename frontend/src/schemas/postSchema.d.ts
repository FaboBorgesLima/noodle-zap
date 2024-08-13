import { CommentSchema } from "./commentSchema";
import { UserMongoDb } from "./userMongodb";

export interface PostSchema {
    title: string;
    text: string;
    user: UserMongoDb;
    date: number;
    comments: CommentSchema[];
    likes: { date: number; user: UserMongoDb }[];
    id: string;
}
