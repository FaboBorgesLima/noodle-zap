import { UserMongoDb } from "./userMongodb";

export interface CommentSchema {
    text: string;
    date: number;
    user: UserMongoDb;
}
