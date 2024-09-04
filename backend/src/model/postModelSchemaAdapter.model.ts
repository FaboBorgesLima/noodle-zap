import { PostSchema } from "../schema/post.schema";
import { PostModel } from "./post.model";
import { CommentModelSchemaAdapter } from "./commentModelSchemaAdapter.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";
import { LikeModelSchemaAdapter } from "./likeModelSchemaAdapter.model";
import { Int32 } from "mongodb";

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
            nLike: new Int32(model.getNLikes()),
            nComment: new Int32(model.getNComments()),
        };
    }

    static schemaToModel(schema: PostSchema): PostModel {
        return PostModel.factory(
            schema.text,
            MongodbUserModelSchemaAdapter.schemaToModelInDb(schema.usr),
            schema.title,
            schema.dt,
            schema.comments.map((comment) =>
                CommentModelSchemaAdapter.schemaInModelInDb(comment)
            ),
            schema.likes.map((like) =>
                LikeModelSchemaAdapter.schemaToModel(like)
            ),
            schema.nLike.value,
            schema.nComment.value
        );
    }
}
