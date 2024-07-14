import { MongodbUserSchema } from "./mongodbUser.schema";

export interface LikeSchema {
    usr: MongodbUserSchema;
    dt: Date;
}
