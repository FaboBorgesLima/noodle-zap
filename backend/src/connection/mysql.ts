import { createConnection } from "mysql2/promise";
import { env } from "../config/env";

export const promiseConnection = createConnection({
    host: "mysql",
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
});
