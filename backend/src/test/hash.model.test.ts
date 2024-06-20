import { describe, expect, it, test } from "@jest/globals";
import { HashMaker } from "../model/hashMaker.model";

describe("hash model", () => {
    test("right length", () => {
        for (let word = "a"; word.length < 1000; word += "a") {
            expect(HashMaker.make(word).length).toBe(44);
        }
    });
    test("generates same hash with same input", () => {
        expect(HashMaker.make("aaaa")).toBe(HashMaker.make("aaaa"));
    });
    test("generates different hash with different input", () => {
        expect(HashMaker.make("aaab") == HashMaker.make("aaaa")).toBeFalsy();
    });
});
