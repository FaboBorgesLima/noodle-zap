import { ObjectId } from "mongodb";
import { MongodbUserSchema } from "./mongodbUser.schema";

export interface LikeSchema {
    usr: MongodbUserSchema;
    dt: Date;
}
