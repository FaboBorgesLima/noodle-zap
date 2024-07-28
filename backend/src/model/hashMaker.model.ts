import { Hmac, createHmac } from "crypto";
import { env } from "../config/env";

export class HashMaker {
    public static make(msg: string): string {
        const hmac = this.getHmac();
        hmac.update(msg);

        return hmac.digest("base64");
    }

    private static getHmac(): Hmac {
        return createHmac("sha256", env.HMAC_KEY);
    }
}
