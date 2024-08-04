import { describe, expect, test } from "@jest/globals";
import { Validator } from "../model/helpers/validator.model";

describe("validator", () => {
    test("email", () => {
        expect(Validator.validateEmail("email@email.com")).toBeTruthy();

        expect(Validator.validateEmail("email@email.co")).toBeTruthy();
        expect(Validator.validateEmail("emailemail.com")).toBeFalsy();
        expect(Validator.validateEmail(" email@email.com")).toBeFalsy();
        expect(Validator.validateEmail("email@email.c")).toBeTruthy();
    });
    test("string length", () => {
        expect(Validator.validateStringLength(2, 3)("a")).toBeFalsy();
        expect(Validator.validateStringLength(2, 3)("aa")).toBeTruthy();
        expect(Validator.validateStringLength(2, 3)("aaa")).toBeTruthy();
        expect(Validator.validateStringLength(2, 3)("aaaa")).toBeFalsy();
    });
    test("name", () => {
        expect(Validator.validateName("aa")).toBeFalsy();
        expect(Validator.validateName("aaa")).toBeTruthy();
        expect(Validator.validateName(" aaa")).toBeFalsy();
        expect(Validator.validateName("aaa ")).toBeFalsy();
        expect(
            Validator.validateName(
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            )
        ).toBeTruthy();
        expect(
            Validator.validateName(
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            )
        ).toBeFalsy();
    });
});
