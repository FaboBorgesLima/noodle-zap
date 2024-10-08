import { afterAll, describe, expect, test } from "@jest/globals";
import { pool } from "../connection/mysql";
import { UserStorage } from "../model/storage/userStorage.model";
import { UserModel } from "../model/user.model";
import { env } from "../config/env";
import { mongoClient } from "../connection/mongo";

describe("user storage", () => {
    test("can crud", async () => {
        if (env.IS_PROD?.toUpperCase() != "FALSE")
            throw Error("must be executed in dev or test enviroment");

        const conn = await pool.getConnection();

        const storage = new UserStorage(conn, mongoClient);

        // create
        const userModel = UserModel.createFactory(
            "name",
            "name@name.com",
            "apassword"
        );

        if (!userModel) return;

        const user = await storage.create(userModel);

        expect(user).toBeTruthy();

        if (!user) return;

        // update

        expect(user.getItem().getName()).toBe("name");

        user.getItem().setName("name2");

        storage.update(user);

        // read

        const userRead = await storage.getById(user.getRawId());

        expect(userRead).toBeTruthy();

        if (!userRead) return;

        expect(userRead.getItem().getName()).toBe("name2");

        // get by name

        const userByName = await storage.getByName("name2");

        expect(userByName).toBeTruthy();

        if (!userByName) return;

        expect(userByName.getItem().getName()).toBe("name2");

        // delete

        await storage.delete(userRead.getRawId());

        const userReadDeleted = await storage.getById(user.getRawId());

        expect(userReadDeleted).toBeFalsy();

        await conn.rollback();
        conn.release();
    }, 10000);

    test("try to delete non existing user", async () => {
        if (env.IS_PROD?.toUpperCase() != "FALSE")
            throw Error("must be executed in dev or test enviroment");
        const conn = await pool.getConnection();

        await conn.beginTransaction();

        const storage = new UserStorage(conn, mongoClient);

        const result = await storage.delete(999999);

        expect(result).toBeFalsy();

        await conn.rollback();

        conn.release();
    });
});
