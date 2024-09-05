import { LikeSchema } from "../schema/like.schema";
import { LikeModel } from "./likeModel.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";

export class LikeModelSchemaAdapter {
    static modelToSchema(model: LikeModel): LikeSchema {
        return {
            dt: model.date,
            usr: MongodbUserModelSchemaAdapter.modelInDbToSchema(model.user),
            post: model.postId,
        };
    }
    static schemaToModel(schema: LikeSchema): LikeModel {
        return LikeModel.load(
            MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
            schema.dt,
            schema.post
        );
    }
}
