import { Int32 } from "mongodb";

export interface MongodbUserSchema {
    id: Int32;
    name: string;
    email: string;
}
