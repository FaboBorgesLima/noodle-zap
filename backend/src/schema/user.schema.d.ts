import { RowDataPacket } from "mysql2";

interface UserSchema extends RowDataPacket {
    user_id: number;
    email: string;
    user_name: string;
    user_password: string;
    token: string;
}
