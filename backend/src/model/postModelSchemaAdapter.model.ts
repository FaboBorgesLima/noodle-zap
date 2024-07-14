import { ObjectId, Timestamp } from "mongodb";
import { PostSchema } from "../schema/post.schema";
import { ItemInDb } from "./itemInDb.model";
import { PostModel } from "./post.model";
import { CommentModelSchemaAdapter } from "./commentModelSchemaAdapter.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";
import { LikeModelSchemaAdapter } from "./likeModelSchemaAdapter.model";

export class PostModelSchemaAdapter {
    static modelToSchema(model: PostModel): PostSchema {
        return {
            comments: model
                .getComments()
                .map((comment) =>
                    CommentModelSchemaAdapter.modelInDbToSchema(comment)
                ),
            dt: model.getDate(),
            likes: model
                .getLikes()
                .map((like) => LikeModelSchemaAdapter.modelToSchema(like)),
            text: model.getText(),
            title: model.getTitle(),
            usr: MongodbUserModelSchemaAdapter.modelInDbToSchema(
                model.getUser()
            ),
        };
    }

    static schemaToModel(schema: PostSchema): PostModel {
        return PostModel.load(
            schema.text,
            MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
            schema.title,
            schema.dt,
            schema.comments.map((comment) =>
                CommentModelSchemaAdapter.schemaInModelInDb(comment)
            ),
            schema.likes.map((like) =>
                LikeModelSchemaAdapter.schemaToModel(like)
            )
        );
    }
}
