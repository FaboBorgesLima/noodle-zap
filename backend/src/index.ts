import { env } from "process";
import { promiseConnection } from "./connection/mysql";

async function main() {
    console.log(env);
}
main();
