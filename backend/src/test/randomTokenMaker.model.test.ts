import { describe, expect, test } from "@jest/globals";
import { RandomTokenMaker } from "../model/helpers/randomTokenMaker.model";

describe("random token maker", () => {
    test("is right length", () => {
        for (let i = 0; i < 1000; i++) {
            expect(RandomTokenMaker.make().length).toBe(44);
        }
    });
    test("generates different token", () => {
        let lastToken = RandomTokenMaker.make();
        for (let i = 0; i < 1000; i++) {
            let newToken = RandomTokenMaker.make();

            expect(lastToken == newToken).toBeFalsy();

            lastToken = newToken;
        }
    });
});
