import { UserMongoDb } from "./userMongodb";

export interface PostSchema {
    title: string;
    text: string;
    user: UserMongoDb;
    date: number;
    comments: { text: string; date: number; user: UserMongoDb }[];
    likes: { date: number; user: UserMongoDb }[];
    id: string;
}
