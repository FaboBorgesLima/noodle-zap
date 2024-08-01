export interface EnvInterface {
    MONGO_INITDB_DATABASE: string;
    MONGO_INITDB_USERNAME: string;
    MONGO_INITDB_PASSWORD: string;
    MYSQL_DATABASE: string;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    HMAC_KEY: string;
    TZ?: string;
    IS_PROD?: string;
}
class EnvVarError extends Error {
    constructor(envVar: string, val: any) {
        super(`env var: ${envVar} has the value '${val}' , please fix it`);
    }
}
export const env = getEnv();

function getEnv(): EnvInterface {
    // mongodb vars
    if (!process.env.MONGO_INITDB_DATABASE) {
        throw new EnvVarError(
            "MONGO_INITDB_DATABASE",
            process.env.MONGO_INITDB_DATABASE
        );
    }
    if (!process.env.MONGO_INITDB_USERNAME) {
        throw new EnvVarError(
            "MONGO_INITDB_DATABASE",
            process.env.MONGO_INITDB_USERNAME
        );
    }
    if (!process.env.MONGO_INITDB_PASSWORD) {
        throw new EnvVarError(
            "MONGO_INITDB_PASSWORD",
            process.env.MONGO_INITDB_PASSWORD
        );
    }
    // mysql vars
    if (!process.env.MYSQL_DATABASE) {
        throw new EnvVarError("MYSQL_DATABASE", process.env.MYSQL_DATABASE);
    }
    if (!process.env.MYSQL_USER) {
        throw new EnvVarError("MYSQL_USER", process.env.MYSQL_USER);
    }
    if (!process.env.MYSQL_PASSWORD) {
        throw new EnvVarError("MYSQL_PASSWORD", process.env.MYSQL_PASSWORD);
    }
    // backend vars
    if (!process.env.HMAC_KEY) {
        throw new EnvVarError("HMAC_KEY", process.env.HMAC_KEY);
    }
    if (!process.env.IS_PROD) {
        throw new EnvVarError("IS_PROD", process.env.IS_PROD);
    }

    return <EnvInterface>(<unknown>process.env);
}
