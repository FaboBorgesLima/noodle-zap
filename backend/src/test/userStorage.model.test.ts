import { afterAll, beforeAll, describe, expect, it, test } from "@jest/globals";
import { beforeEach } from "node:test";
import { promiseConnection } from "../connection/mysql";
import { Connection } from "mysql2/promise";
import { UserStorage } from "../model/userStorage.model";
import { UserModel } from "../model/user.model";
import { HashMaker } from "../model/hashMaker.model";
import { env } from "../config/env";

describe("user storage", () => {
    test("can crud", async () => {
        if (env.IS_PROD?.toUpperCase() != "FALSE")
            throw Error("must be executed in dev or test enviroment");
        const conn = await promiseConnection.getConnection();

        await conn.beginTransaction();

        const storage = new UserStorage(conn);

        // create

        const user = await storage.create(
            new UserModel(
                "name",
                "email@email.com",
                HashMaker.make("a"),
                HashMaker.make("a")
            )
        );

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
});
