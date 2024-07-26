import { ObjectId } from "mongodb";
import { CommentSchema } from "../schema/comment.schema";
import { CommentModel } from "./comment.model";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

export class CommentModelSchemaAdapter {
    static modelInDbToSchema(
        model: ItemInDb<CommentModel, ObjectId>
    ): CommentSchema {
        return {
            _id: model.getRawId(),
            dt: model.getItem().getDate(),
            usr: MongodbUserModelSchemaAdapter.modelInDbToSchema(
                model.getItem().getUser()
            ),
            text: model.getItem().getText(),
        };
    }

    static schemaInModelInDb(
        schema: CommentSchema
    ): ItemInDb<CommentModel, ObjectId> {
        return new ItemInDbObjectId<CommentModel>(
            CommentModel.loadFactory(
                schema.text,
                MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
                schema.dt
            ),
            schema._id
        );
    }
}
