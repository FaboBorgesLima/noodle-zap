import { describe, expect, test } from "@jest/globals";
import { mongoClient } from "../connection/mongo";
import { PostStorage } from "../model/storage/postStorage.model";
import { PostModel } from "../model/post.model";
import { ItemInDbInt32 } from "../model/itemInDbInt32.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { Int32 } from "mongodb";

describe("post storage", () => {
    test("can crud", async () => {
        const storage = new PostStorage(mongoClient);

        const post = PostModel.factory(
            "comment",
            new ItemInDbInt32(
                MongodbUserModel.factory("test", "test@test.com"),
                new Int32(0)
            ),
            "title"
        );

        if (!post) return;

        //create
        const postInDb = await storage.create(post);

        expect(postInDb).toBeTruthy();

        if (!postInDb) return;

        //read

        let postFromDb = await storage.getById(postInDb.getRawId());

        expect(postFromDb).toBeTruthy();

        if (!postFromDb) return;

        //update

        const oldText = postFromDb.getItem().getText();

        const newText = "new text";

        postFromDb.getItem().setText(newText);

        postFromDb = await storage.update(postFromDb);

        expect(postFromDb).toBeTruthy();

        if (!postFromDb) return;

        expect(postFromDb.getItem().getText()).not.toBe(oldText);

        // delete

        const couldDelete = await storage.delete(postInDb.getRawId());

        expect(couldDelete).toBeTruthy();
    });
    test("string length", () => {});
    test("name", () => {});
});
