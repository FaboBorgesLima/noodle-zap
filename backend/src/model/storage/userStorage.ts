import { UserSchema } from "../../schema/user.schema";
import { MysqlStorage } from "./mysqlStorage";

export class UserStorage extends MysqlStorage<UserSchema> {
    protected TABLE_NAME: string = "users";
}
