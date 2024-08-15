import { NextFunction, Request, Response } from "express";
import { UserStorage } from "../model/storage/userStorage.model";
import { BearerToken } from "../model/helpers/bearerToken.model";
import { UserModel } from "../model/user.model";
import { ItemInDb } from "../model/itemInDb.model";
import { Int32 } from "mongodb";
import { connPoll } from "../connection/mysql";
import { mongoClient } from "../connection/mongo";

export class Auth {
    static async middleware(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const token = BearerToken.getToken(req.headers.authorization);

        if (!token) {
            next("route");
            return;
        }

        const conn = await connPoll.getConnection();

        const userStorage = new UserStorage(conn, mongoClient);

        const user = await userStorage.getByToken(token);

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
