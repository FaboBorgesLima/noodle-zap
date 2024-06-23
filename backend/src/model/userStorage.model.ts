import { Connection, ResultSetHeader } from "mysql2/promise";
import { CommonStorage } from "./commonStorage.model";
import { ItemInDb } from "./itemInDb.model";
import { UserModel } from "./user.model";
import { UserSchema } from "../schema/user.schema";

export class UserStorage extends CommonStorage<UserModel> {
    constructor(private conn: Connection) {
        super();
    }
    async create(item: UserModel): Promise<void | ItemInDb<UserModel>> {
        try {
            const insert = await this.conn.query<ResultSetHeader>(
                "INSERT INTO user (email,user_name,user_password,token) VALUES (?,?,?,?)",
                [
                    item.getEmail(),
                    item.getName(),
                    item.getHashPassword(),
                    item.getToken(),
                ]
            );
            const id = insert[0].insertId;
            return new ItemInDb(item, id.toString());
        } catch {}
    }
    async update(
        itemInDb: ItemInDb<UserModel>
    ): Promise<void | ItemInDb<UserModel>> {
        try {
            const schema = this.modelToSchema(itemInDb);
            const update = await this.conn.query<ResultSetHeader>(
                "UPDATE user SET email = ?, user_name = ?,user_password = ?,token = ? WHERE user_id = ?",
                [
                    schema.email,
                    schema.user_name,
                    schema.user_password,
                    schema.token,
                    schema.user_id,
                ]
            );
        } catch {}
    }
    async delete(id: string): Promise<boolean> {
        try {
            const del = await this.conn.query<ResultSetHeader>(
                "DELETE FROM user WHERE user_id=?",
                [parseInt(id)]
            );

            return Boolean(del[0].affectedRows);
        } catch {
            return false;
        }
    }
    async getById(id: string): Promise<void | ItemInDb<UserModel>> {
        try {
            const [usersSchemas] = await this.conn.query<UserSchema[]>(
                "SELECT * FROM user WHERE user_id = ?",
                [parseInt(id)]
            );

            if (usersSchemas.length == 0) return;

            const userSchema = usersSchemas[0];

            return new ItemInDb(
                this.schemaToModel(userSchema),
                userSchema.user_id.toString()
            );
        } catch {}
    }

    private schemaToModel(schema: UserSchema): UserModel {
        return UserModel.loadFactory(
            schema.user_name,
            schema.email,
            schema.user_password,
            schema.token
        );
    }

    private modelToSchema(userInDb: ItemInDb<UserModel>): UserSchema {
        return {
            user_id: parseInt(userInDb.getId()),
            user_name: userInDb.getItem().getName(),
            email: userInDb.getItem().getEmail(),
            token: userInDb.getItem().getToken(),
            user_password: userInDb.getItem().getHashPassword(),
            constructor: { name: "RowDataPacket" },
        };
    }
}
