import { HashMaker } from "../helpers/hashMaker.model";
import { RandomTokenMaker } from "../helpers/randomTokenMaker.model";
import { Validator } from "../helpers/validator.model";
import { Entity } from "./entity.model";
import { UserSchema } from "../../schema/user.schema";
import { MongodbUserSchema } from "../../schema/mongodbUser.schema";
import { Int32 } from "mongodb";

export class UserModel extends Entity<UserSchema> {
    randomizeToken(): UserModel {
        this.attributes.token = RandomTokenMaker.make();
        return this;
    }

    toMongodb(): MongodbUserSchema {
        if (!this.id) throw new Error("user must be registered in db");

        return {
            email: this.getEmail(),
            id: new Int32(this.id),
            name: this.getName(),
        };
    }

    getEmail(): string {
        return this.attributes.email;
    }

    setEmail(email: string): boolean {
        const clean = Validator.validateEmail(email);
        if (!clean) return false;

        this.attributes.email = clean;

        return true;
    }

    getName(): string {
        return this.attributes.name;
    }

    setName(name: string): boolean {
        const clean = Validator.validateName(name);

        if (!clean) return false;

        this.attributes.name = clean;

        return true;
    }

    getToken(): string {
        return this.attributes.token;
    }

    getHashPassword(): string {
        return this.attributes.password;
    }

    setAndHashPassword(password: string): boolean {
        const clean = Validator.validatePassword(password);

        if (!clean) return false;

        this.attributes.password = HashMaker.make(clean);

        return true;
    }

    toJSON() {
        return {
            name: this.attributes.name,
            email: this.attributes.email,
            token: this.attributes.token,
        };
    }
}
