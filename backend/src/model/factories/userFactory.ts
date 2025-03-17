import { UserSchema } from "../../schema/user.schema";
import { EntityFactory } from "./entityFactory";
import { UserModel } from "../entities/user.model";

export class UserFactory extends EntityFactory<UserModel> {
    public getDefault(): UserSchema {
        return {
            email: "",
            name: "",
            password: "",
            token: "",
        };
    }
}
