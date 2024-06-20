export const env = <
    {
        MONGO_INITDB_DATABASE: string;
        MONGO_INITDB_USERNAME: string;
        MONGO_INITDB_PASSWORD: string;
        MYSQL_DATABASE: string;
        MYSQL_USER: string;
        MYSQL_PASSWORD: string;
        HMAC_KEY: string;
    }
>process.env;
