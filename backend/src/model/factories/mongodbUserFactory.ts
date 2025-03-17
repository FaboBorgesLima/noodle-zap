import { EntityFactory } from "./entityFactory";
import { Int32 } from "mongodb";
import { MongodbUserModel } from "../entities/mongodbUser.model";
import { MongodbUserSchema } from "../../schema/mongodbUser.schema";
import { UserModel } from "../entities/user.model";

export class MongodbUserFactory extends EntityFactory<MongodbUserModel> {
    public fromUser(user: UserModel): MongodbUserModel {
        return this.factory({
            id: user.id ?? 0,
            schema: {
                email: user.getEmail(),
                name: user.getName(),
                id: new Int32(user.id ?? 0),
            },
        });
    }

    public getDefault(): MongodbUserSchema {
        return {
            id: new Int32(0),
            name: "",
            email: "",
        };
    }
}
