import { describe, expect, test } from "@jest/globals";
import { LikeModel } from "../model/likeModel.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { ItemInDb } from "../model/itemInDb.model";
import { LikeModelSchemaAdapter } from "../model/likeModelSchemaAdapter.model";

describe("like model schema adapter", () => {
    test("date is the same", () => {
        const userEmail = "email@email.com";
        const userName = "name";
        const userId = "123";

        const model = LikeModel.load(
            new ItemInDb(MongodbUserModel.factory(userName, userEmail), userId),
            new Date()
        );

        const schema = LikeModelSchemaAdapter.modelToSchema(model);

        expect(schema.dt.getDate()).toBe(model.date.getDate());
    });
});
