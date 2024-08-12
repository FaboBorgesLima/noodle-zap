import { NextFunction, Request, Response } from "express";
import { Middleware } from "./middleware";
import { UserStorage } from "../model/storage/userStorage.model";
import { BearerToken } from "../model/helpers/bearerToken.model";
import { UserModel } from "../model/user.model";
import { ItemInDb } from "../model/itemInDb.model";
import { Int32 } from "mongodb";

export class Auth extends Middleware {
    constructor(private userStorage: UserStorage) {
        super();
    }

    async middleware(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const token = BearerToken.getToken(req.headers.authorization);

        if (!token) {
            next("route");
            return;
        }

        const user = await this.userStorage.getByToken(token);

        if (!user) {
            next("route");
            return;
        }

        res.locals.user = user;

        next();
    }
}
export type ResponseWithAuth = Response<
    any,
    { user: ItemInDb<UserModel, Int32> }
>;
