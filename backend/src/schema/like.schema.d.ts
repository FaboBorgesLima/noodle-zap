import { ObjectId } from "mongodb";
import { MongodbUserSchema } from "./mongodbUser.schema";

export interface LikeSchema {
    _id: ObjectId;
    usr: MongodbUserSchema;
    dt: Date;
}
