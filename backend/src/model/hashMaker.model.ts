import { createHash, createHmac } from "crypto";
import { env } from "../config/env";

export class HashMaker {
    public static make(msg: string): string {
        const hmac = createHmac("sha256", env.HMAC_KEY);
        hmac.update(msg);

        return hmac.digest("base64");
    }
}
