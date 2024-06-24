import { Validator } from "./validator.model";

export class BearerToken {
    static getToken(auth: unknown): string | void {
        if (typeof auth != "string") return;

        const parts = auth.split(" ");

        if (parts.length != 2) return;

        return Validator.validateStringLength(44)(parts[1]);
    }
}
