import { randomBytes } from "crypto";

export class RandomTokenMaker {
    static make(): string {
        const bytes = randomBytes(32);

        return bytes.toString("base64");
    }
}
