import { Int32, ObjectId } from "mongodb";

export class Validator {
    /**
     * @returns a email if it is valid
     */
    static validateEmail(email: unknown): string | void {
        if (typeof email != "string") return;
        const regex =
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/y;

        if (!regex.test(email)) return;

        return email;
    }

    /**
     * @returns a password if it is valid
     */
    static validatePassword(password: unknown): string | void {
        if (typeof password != "string") return;

        if (password.length < 6) return;

        return password;
    }

    /**
     * @returns a name with 3 to 50 letters, without spaces before/after, or void
     */
    static validateName(name: unknown): string | void {
        if (typeof name != "string") return;

        if (name.length < 3 || name.length > 50 || name.trim() != name) return;

        return name;
    }

    static validateStringLength(
        min: number,
        max: number = min
    ): (param: unknown) => string | void {
        return (param) => {
            if (typeof param != "string") return;

            if (param.length < min || param.length > max) return;

            return param;
        };
    }

    static validateUnsignInt(n: unknown): number | void {
        let parsed = 0;
        if (typeof n == "string") parsed = parseInt(n);
        if (typeof n == "number") parsed = n;

        if (parsed % 1 != 0) return;

        if (parsed < 0) return;

        return parsed;
    }

    static validateObjectIdHexString(hex: unknown): ObjectId | void {
        if (typeof hex != "string") return;

        try {
            return ObjectId.createFromHexString(hex);
        } catch {}
    }

    static validateInt32(n: unknown): Int32 | void {
        let int32String = "";

        if (typeof n == "number") {
            int32String = n.toString();
        } else if (typeof n == "string") {
            int32String = n;
        } else {
            return;
        }

        try {
            return Int32.fromString(int32String);
        } catch {}
    }
}
