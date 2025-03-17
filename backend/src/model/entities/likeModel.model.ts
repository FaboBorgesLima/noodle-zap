import { Int32, ObjectId } from "mongodb";
import { HasJSON } from "../../@types/hasJson.interface";
import { MongodbUserModel } from "./mongodbUser.model";
import { Entity } from "./entity.model";
import { LikeSchema } from "../../schema/like.schema";

export class LikeModel extends Entity<LikeSchema> {
    //
}
