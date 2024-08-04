import { HashMaker } from "./helpers/hashMaker.model";
import { HasJSON } from "./hasJson.interface";
import { RandomTokenMaker } from "./helpers/randomTokenMaker.model";
import { Validator } from "./helpers/validator.model";

export class UserModel implements HasJSON {
    protected constructor(
        protected name: string,
        protected email: string,
        protected token: string,
        protected hashPassword: string
    ) {}

    static createFactory(
        name: string,
        email: string,
        password: string
    ): UserModel | void {
        const user = new UserModel("", "", "", "");

        const everyThingSet =
            user.setAndHashPassword(password) &&
            user.setEmail(email) &&
            user.setName(name);

        user.randomizeToken();

        if (!everyThingSet) return;

        return user;
    }

    randomizeToken() {
        this.token = RandomTokenMaker.make();
    }

    static loadFactory(
        name: string,
        email: string,
        hashPassword: string,
        token: string
    ): UserModel {
        return new UserModel(name, email, token, hashPassword);
    }

    getEmail(): string {
        return this.email;
    }
    setEmail(email: string): boolean {
        const clean = Validator.validateEmail(email);
        if (!clean) return false;

        this.email = clean;

        return true;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): boolean {
        const clean = Validator.validateName(name);

        if (!clean) return false;

        this.name = clean;

        return true;
    }

    getToken(): string {
        return this.token;
    }

    getHashPassword(): string {
        return this.hashPassword;
    }

    setAndHashPassword(password: string): boolean {
        const clean = Validator.validatePassword(password);

        if (!clean) return false;

        this.hashPassword = HashMaker.make(clean);

        return true;
    }

    toJSON() {
        return { name: this.name, email: this.email, token: this.token };
    }
}

export interface UserParams {
    name: string;
    email: string;
    password: string;
}
