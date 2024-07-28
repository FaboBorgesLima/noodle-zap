import { describe, expect, test } from "@jest/globals";
import { LikeModel } from "../model/likeModel.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { LikeModelSchemaAdapter } from "../model/likeModelSchemaAdapter.model";
import { ItemInDbInt32 } from "../model/itemInDbInt32.model";
import { Int32 } from "mongodb";

describe("like model schema adapter", () => {
    test("date is the same", () => {
        const userEmail = "email@email.com";
        const userName = "name";
        const userId = "123";

        const model = LikeModel.load(
            new ItemInDbInt32(
                MongodbUserModel.factory(userName, userEmail),
                new Int32(0)
            ),
            new Date()
        );

        const schema = LikeModelSchemaAdapter.modelToSchema(model);

        expect(schema.dt.getDate()).toBe(model.date.getDate());
    });
});
