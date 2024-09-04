import { ObjectId } from "mongodb";
import { LikeSchema } from "../schema/like.schema";
import { ItemInDb } from "./itemInDb.model";
import { LikeModel } from "./likeModel.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

export class LikeModelSchemaAdapter {
    static modelToSchema(itemInDb: ItemInDb<LikeModel, ObjectId>): LikeSchema {
        return {
            dt: itemInDb.getItem().date,
            usr: MongodbUserModelSchemaAdapter.modelInDbToSchema(
                itemInDb.getItem().user
            ),
            _id: itemInDb.getRawId(),
        };
    }
    static schemaToModel(schema: LikeSchema): ItemInDb<LikeModel, ObjectId> {
        return new ItemInDbObjectId(
            LikeModel.load(
                MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
                schema.dt
            ),
            schema._id
        );
    }
}
