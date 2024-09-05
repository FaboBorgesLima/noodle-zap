import { PostSchema } from "../schema/post.schema";
import { PostModel } from "./post.model";
import { CommentModelSchemaAdapter } from "./commentModelSchemaAdapter.model";
import { MongodbUserModelSchemaAdapter } from "./mongodbUserModelSchemaAdapter.model";
import { LikeModelSchemaAdapter } from "./likeModelSchemaAdapter.model";
import { Int32 } from "mongodb";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

export class PostModelSchemaAdapter {
    static modelToSchema(model: PostModel): PostSchema {
        return {
            comments: model
                .getComments()
                .map((comment) => ({
                    ...CommentModelSchemaAdapter.modelToSchema(
                        comment.getItem()
                    ),
                    _id: comment.getRawId(),
                })),
            dt: model.getDate(),
            likes: model
                .getLikes()
                .map((like) => ({
                    ...LikeModelSchemaAdapter.modelToSchema(like.getItem()),
                    _id: like.getRawId(),
                })),
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
            schema.comments.map(
                (comment) =>
                    new ItemInDbObjectId(
                        CommentModelSchemaAdapter.schemaToModel(comment),
                        comment._id
                    )
            ),
            schema.likes.map(
                (like) =>
                    new ItemInDbObjectId(
                        LikeModelSchemaAdapter.schemaToModel(like),
                        like._id
                    )
            ),
            schema.nLike.value,
            schema.nComment.value
        );
    }
}
