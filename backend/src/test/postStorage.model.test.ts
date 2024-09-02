import { beforeEach, describe, expect, test } from "@jest/globals";
import { mongoClient } from "../connection/mongo";
import { PostStorage } from "../model/storage/postStorage.model";
import { PostModel } from "../model/post.model";
import { ItemInDbInt32 } from "../model/itemInDbInt32.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { Int32, ObjectId } from "mongodb";
import { LikeModel } from "../model/likeModel.model";
import { ItemInDbObjectId } from "../model/itemInDbObjectId.model";
import { afterEach } from "node:test";

describe("post storage", () => {
    /**
     * a default user for tests
     */
    const defaultUser = new ItemInDbInt32(
        MongodbUserModel.factory("test", "test@test.com"),
        new Int32(0)
    );

    /**
     * a default post for tests
     */
    const defaultPost = PostModel.factory("text", defaultUser, "title");

    if (!defaultPost) return;
    const storage = new PostStorage(mongoClient);

    /**
     *  this variable is reseted after each test
     */
    let defaultPostInStorage = new ItemInDbObjectId(
        defaultPost,
        new ObjectId()
    );

    beforeEach(async () => {
        const tryCreatePost = await storage.create(defaultPost);
        if (tryCreatePost) defaultPostInStorage = tryCreatePost;
    });

    test("can create and delete", async () => {
        //create
        const postInDb = await storage.create(defaultPost);

        expect(postInDb).toBeTruthy();

        if (!postInDb) return;

        // delete

        const couldDelete = await storage.delete(postInDb.getRawId());

        expect(couldDelete).toBeTruthy();
    });

    test("can read", async () => {
        const canRead = await storage.getById(defaultPostInStorage.getRawId());

        if (!canRead) {
            expect(canRead).toBeTruthy();
            return;
        }
        expect(canRead.getItem().getDate().toString()).toBe(
            defaultPostInStorage.getItem().getDate().toString()
        );
        expect(canRead.getItem().getText()).toBe(
            defaultPostInStorage.getItem().getText()
        );
        expect(canRead.getItem().getTitle()).toBe(
            defaultPostInStorage.getItem().getTitle()
        );
    });

    test("can update", async () => {
        defaultPostInStorage.getItem().setText("new text");

        const couldUpdateText = await storage.update(defaultPostInStorage);

        expect(couldUpdateText).toBeTruthy();
    });

    test("can add like", async () => {
        const canAdd = await storage.addLike(
            defaultPostInStorage.getRawId(),
            LikeModel.create(defaultUser)
        );

        expect(canAdd).toBeTruthy();
    });

    test("can remove like", async () => {
        const canAdd = await storage.addLike(
            defaultPostInStorage.getRawId(),
            LikeModel.create(defaultUser)
        );

        expect(canAdd).toBeTruthy();

        const canDelete = await storage.removeLike(
            defaultPostInStorage.getRawId(),
            defaultUser.getRawId()
        );

        expect(canDelete).toBeTruthy();
    });

    test("same user cant like twice", async () => {
        await storage.addLike(
            defaultPostInStorage.getRawId(),
            LikeModel.create(defaultUser)
        );

        const cantAdd = await storage.addLike(
            defaultPostInStorage.getRawId(),
            LikeModel.create(defaultUser)
        );

        expect(cantAdd).toBeFalsy();
    });

    afterEach(async () => {
        await storage.delete(defaultPostInStorage.getRawId());
    });
});
