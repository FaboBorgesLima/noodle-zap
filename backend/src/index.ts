import { env } from "process";
import { promiseConnection } from "./connection/mysql";

async function main() {
    const conn = await promiseConnection;
}
main();
