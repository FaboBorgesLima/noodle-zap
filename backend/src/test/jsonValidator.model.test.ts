import { describe, expect, test } from "@jest/globals";
import { Validator } from "../model/validator.model";
import { JsonValidator } from "../model/jsonValidator.model";

describe("validator", () => {
    test("email", () => {
        const validator = new JsonValidator({
            str: Validator.validateStringLength(2, 2),
            str2: Validator.validateStringLength(2, 2),
        });

        expect(validator.validate({ str: "aa", str2: "aa" })).toBeTruthy();
        expect(validator.validate({ str: "aaa", str2: "aa" })).toBeFalsy();
        expect(validator.validate({ str: "aa", str2: "aaa" })).toBeFalsy();
    });
});
