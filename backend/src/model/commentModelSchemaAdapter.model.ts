import { ObjectId } from "mongodb";
import { CommentSchema } from "../schema/comment.schema";
import { CommentModel } from "./comment.model";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";

export class CommentModelSchemaAdapter {
    static modelInDbToSchema(model: ItemInDb<CommentModel>): CommentSchema {
        return {
            _id: ObjectId.createFromHexString(model.getId()),
            dt: model.getItem().getDate(),
            usr: MongodbUserModelSchemaAdapter.modelInDbToSchema(
                model.getItem().getUser()
            ),
            text: model.getItem().getText(),
        };
    }

    static schemaInModelInDb(schema: CommentSchema): ItemInDb<CommentModel> {
        return new ItemInDb<CommentModel>(
            CommentModel.loadFactory(
                schema.text,
                MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
                schema.dt
            ),
            schema._id.toHexString()
        );
    }
}
