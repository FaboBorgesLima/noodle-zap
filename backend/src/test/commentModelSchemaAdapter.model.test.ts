import { describe, expect, test } from "@jest/globals";
import { ItemInDb } from "../model/itemInDb.model";
import { CommentModel } from "../model/comment.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { CommentModelSchemaAdapter } from "../model/commentModelSchemaAdapter.model";
import { CommentSchema } from "../schema/comment.schema";
import { Int32, ObjectId } from "mongodb";
import { ItemInDbObjectId } from "../model/itemInDbObjectId.model";
import { ItemInDbInt32 } from "../model/itemInDbInt32.model";

describe("comment user model schema adapter", () => {
    test("model in db to schema", () => {
        const model = new ItemInDbObjectId(
            CommentModel.loadFactory(
                "text",
                new ItemInDbInt32(
                    MongodbUserModel.factory("name", "email@email.com"),
                    new Int32(0)
                ),
                new Date()
            ),
            new ObjectId()
        );

        const schema = CommentModelSchemaAdapter.modelInDbToSchema(model);

        expect(model.getId()).toBe(schema._id.toHexString());

        expect(model.getItem().getDate().toString()).toBe(schema.dt.toString());

        expect(model.getItem().getText()).toBe(schema.text);
    });
    test("schema to model in db", () => {
        const schema: CommentSchema = {
            _id: new ObjectId(),
            dt: new Date(),
            text: "text",
            usr: { email: "email@email", id: new Int32(0), name: "name" },
        };

        const model = CommentModelSchemaAdapter.schemaInModelInDb(schema);

        expect(model.getId()).toBe(schema._id.toHexString());

        expect(model.getItem().getDate().toString()).toBe(schema.dt.toString());

        expect(model.getItem().getText()).toBe(schema.text);
    });
});
