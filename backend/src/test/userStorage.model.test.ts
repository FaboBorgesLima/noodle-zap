import { afterAll, beforeAll, describe, expect, it, test } from "@jest/globals";
import { beforeEach } from "node:test";
import { connPoll } from "../connection/mysql";
import { Connection } from "mysql2/promise";
import { UserStorage } from "../model/userStorage.model";
import { UserModel } from "../model/user.model";
import { HashMaker } from "../model/hashMaker.model";
import { env } from "../config/env";

describe("user storage", () => {
    test("can crud", async () => {
        if (env.IS_PROD?.toUpperCase() != "FALSE")
            throw Error("must be executed in dev or test enviroment");

        const conn = await connPoll.getConnection();

        await conn.beginTransaction();

        const storage = new UserStorage(conn);

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

        const userRead = await storage.getById(user.getId());

        expect(userRead).toBeTruthy();

        if (!userRead) return;

        expect(userRead.getItem().getName()).toBe("name2");

        // delete

        await storage.delete(userRead.getId());

        const userReadDeleted = await storage.getById(user.getId());

        expect(userReadDeleted).toBeFalsy();

        await conn.rollback();

        conn.release();
    }, 10000);

    test("try to delete non existing user", async () => {
        if (env.IS_PROD?.toUpperCase() != "FALSE")
            throw Error("must be executed in dev or test enviroment");
        const conn = await connPoll.getConnection();

        await conn.beginTransaction();

        const storage = new UserStorage(conn);

        const result = await storage.delete("999999");

        expect(result).toBeFalsy();

        await conn.rollback();

        conn.release();
    });

    afterAll(() => {
        connPoll.end();
    });
});
