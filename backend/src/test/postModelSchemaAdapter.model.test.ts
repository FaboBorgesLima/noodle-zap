import { describe, expect, test } from "@jest/globals";
import { PostModel } from "../model/post.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { PostModelSchemaAdapter } from "../model/postModelSchemaAdapter.model";
import { CommentModel } from "../model/comment.model";
import { LikeModel } from "../model/likeModel.model";
import { Int32, ObjectId } from "mongodb";
import { PostSchema } from "../schema/post.schema";
import { ItemInDbInt32 } from "../model/itemInDbInt32.model";
import { ItemInDbObjectId } from "../model/itemInDbObjectId.model";

describe("post model schema adapter", () => {
    test("model to schema", () => {
        const text = "text";
        const title = "title";
        const user = new ItemInDbInt32(
            MongodbUserModel.factory("user", "email@email.com"),
            new Int32(123)
        );
        const postId = new ObjectId();

        const model = PostModel.factory(
            text,
            user,
            title,
            new Date(),
            [
                new ItemInDbObjectId(
                    CommentModel.loadFactory(
                        "comment",
                        user,
                        new Date(),
                        postId
                    ),
                    new ObjectId()
                ),
            ],
            [
                new ItemInDbObjectId(
                    LikeModel.load(user, new Date(), postId),
                    new ObjectId()
                ),
            ],
            1,
            1
        );

        const schema = PostModelSchemaAdapter.modelToSchema(model);

        expect(schema.dt.toString()).toBe(model.getDate().toString());

        expect(schema.title).toBe(model.getTitle());

        expect(schema.text).toBe(model.getText());

        for (let i = 0; i < schema.comments.length; i++) {
            expect(schema.comments[i]._id.toHexString()).toBe(
                model.getComments()[i].getId()
            );
        }

        for (let i = 0; i < schema.likes.length; i++) {
            expect(schema.likes[i].dt.toString()).toBe(
                model.getLikes()[i].getItem().date.toString()
            );
        }
    });

    test("schema to model", () => {
        const text = "text";
        const title = "title";
        const postId = new ObjectId();

        const schema: PostSchema = {
            usr: { id: new Int32(0), email: "email@email.com", name: "name" },
            title,
            text,
            comments: [
                {
                    _id: new ObjectId(),
                    dt: new Date(),
                    text: "text",
                    usr: {
                        email: "email@email.com",
                        id: new Int32(0),
                        name: "name",
                    },
                    post: postId,
                },
            ],
            likes: [
                {
                    _id: new ObjectId(),
                    dt: new Date(),
                    usr: {
                        email: "email@email.com",
                        id: new Int32(0),
                        name: "name",
                    },
                    post: postId,
                },
            ],
            dt: new Date(),
            nLike: new Int32(1),
            nComment: new Int32(1),
        };

        const model = PostModelSchemaAdapter.schemaToModel(schema);

        expect(schema.dt.toString()).toBe(model.getDate().toString());

        expect(schema.title).toBe(model.getTitle());

        expect(schema.text).toBe(model.getText());

        for (let i = 0; i < schema.comments.length; i++) {
            expect(schema.comments[i]._id.toHexString()).toBe(
                model.getComments()[i].getId()
            );
        }

        for (let i = 0; i < schema.likes.length; i++) {
            expect(schema.likes[i].dt.toString()).toBe(
                model.getLikes()[i].getItem().date.toString()
            );
        }
    });
});
