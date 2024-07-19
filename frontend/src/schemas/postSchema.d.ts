export interface PostSchema {
    title: string;
    text: string;
    user: UserMongoDb;
    comments: { text: string; date: number; user: UserMongoDb }[];
    likes: { date: number; user: UserMongoDb }[];
}
interface UserMongoDb {
    id: string;
    name: string;
}
