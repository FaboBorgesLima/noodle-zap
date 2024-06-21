import { HashMaker } from "./hashMaker.model";

export class UserModel {
    constructor(
        protected name: string,
        protected email: string,
        protected token: string,
        protected hashPassword: string
    ) {}

    getEmail(): string {
        return this.email;
    }

    getName(): string {
        return this.name;
    }

    getToken(): string {
        return this.token;
    }

    getHashPassword(): string {
        return this.hashPassword;
    }

    setName(name: string): void {
        this.name = name;
    }
}

export interface UserParams {
    name: string;
    email: string;
    password: string;
}
