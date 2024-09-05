import { ObjectId } from "mongodb";
import { CommentSchema } from "../schema/comment.schema";
import { CommentModel } from "./comment.model";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

export class CommentModelSchemaAdapter {
    static modelToSchema(model: CommentModel): CommentSchema {
        return {
            dt: model.getDate(),
            usr: MongodbUserModelSchemaAdapter.modelInDbToSchema(
                model.getUser()
            ),
            text: model.getText(),
            post: model.getPostId(),
        };
    }

    static schemaToModel(schema: CommentSchema): CommentModel {
        return CommentModel.loadFactory(
            schema.text,
            MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
            schema.dt,
            schema.post
        );
    }
}
