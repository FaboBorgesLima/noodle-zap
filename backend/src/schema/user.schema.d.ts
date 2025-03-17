import { RowDataPacket } from "mysql2";
import { Schema } from "../@types/Schema";

interface UserSchema extends Schema {
    email: string;
    name: string;
    password: string;
    token: string;
}
