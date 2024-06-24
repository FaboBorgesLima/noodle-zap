import { NextFunction, Request, Response } from "express";
import { Middleware } from "./middleware";
import { UserStorage } from "../model/userStorage.model";
import { BearerToken } from "../model/bearerToken.model";

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
