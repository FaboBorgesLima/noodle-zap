import { describe, expect, test } from "@jest/globals";
import { MongoDBStorage } from "../model/storage/mongodbStorage";
import { mongoClient } from "../connection/mongo";

class TestMongoDBStorage extends MongoDBStorage<{
    str: string;
    n: number;
    str2: string;
}> {
    protected COLLECTION_NAME: string = "test";
}

describe("mongodbStorage", () => {
    const defaultSchema = {
        n: 0,
        str: "read",
        str2: "test2",
    };

    test("can create", async () => {
        const storage = new TestMongoDBStorage(mongoClient);

        const id = await storage.create(defaultSchema);

        expect(typeof id).toBe("string");
    });

    test("can read", async () => {
        const storage = new TestMongoDBStorage(mongoClient);

        const readDefaultSchema = { ...defaultSchema };

        const randomStr = (Math.random() * 9999).toFixed(0);

        readDefaultSchema.str = randomStr;

        const id = await storage.create(readDefaultSchema);

        const readed = await storage.findById(id);

        if (!readed) {
            expect(readed).toBeDefined();
            return;
        }

        expect(readed).toMatchObject({ str: randomStr });

        const id2 = await storage.create(readDefaultSchema);

        let whereRead = await storage.where([
            { col: "str", operator: "=", value: randomStr },
        ]);

        expect(whereRead.find((schema) => schema.id == id)).toBeDefined();
        expect(whereRead.find((schema) => schema.id == id2)).toBeDefined();

        whereRead = await storage.where([
            { col: "str", operator: "=", value: randomStr },
            { col: "n", operator: ">", value: -1 },
        ]);

        expect(whereRead.find((schema) => schema.id == id)).toBeDefined();
        expect(whereRead.find((schema) => schema.id == id2)).toBeDefined();

        whereRead = await storage.where([
            { col: "str", operator: "=", value: randomStr },
            { col: "n", operator: "<", value: -1 },
        ]);

        expect(whereRead.find((schema) => schema.id == id)).toBeUndefined();
        expect(whereRead.find((schema) => schema.id == id2)).toBeUndefined();
    });

    test("can update", async () => {
        const storage = new TestMongoDBStorage(mongoClient);

        const schema = {
            n: 0,
            str: "test",
            str2: "test2",
        };

        const id = await storage.create(schema);
    });
});
