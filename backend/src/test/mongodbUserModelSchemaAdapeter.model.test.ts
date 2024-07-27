import { describe, expect, test } from "@jest/globals";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { ItemInDb } from "../model/itemInDb.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";
import { Int32 } from "mongodb";
import { MongodbUserSchema } from "../schema/mongodbUser.schema";
import { ItemInDbInt32 } from "../model/itemInDbInt32.model";

describe("mongodb user model schema adapter", () => {
    test("model in db to schema", () => {
        const userEmail = "email@email.com";
        const userName = "name";
        const userId = "123";

        const model = new ItemInDbInt32(
            MongodbUserModel.factory(userName, userEmail),
            new Int32(0)
        );

        const schema = MongodbUserModelSchemaAdapter.modelInDbToSchema(model);

        expect(schema.email).toBe(model.getItem().email);

        expect(schema.id.toString()).toBe(model.getId());

        expect(schema.name).toBe(model.getItem().name);
    });
    test("schema to model in db", () => {
        const schema: MongodbUserSchema = {
            email: "email@email.com",
            id: new Int32(1),
            name: "name",
        };
        const model = MongodbUserModelSchemaAdapter.schemaToModelInDb(schema);

        expect(schema.email).toBe(model.getItem().email);

        expect(schema.id.toString()).toBe(model.getId());

        expect(schema.name).toBe(model.getItem().name);
    });
});
