import { NextFunction, Request, Response } from "express";
import { UserStorage } from "../model/storage/userStorage.model";
import { BearerToken } from "../model/helpers/bearerToken.model";
import { UserModel } from "../model/user.model";
import { ItemInDb } from "../model/itemInDb.model";
import { Int32 } from "mongodb";
import { pool } from "../connection/mysql";
import { mongoClient } from "../connection/mongo";
import { HTTPCodes } from "../enum/httpCodes.enum";

export class Auth {
    static async middleware(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const token = BearerToken.getToken(req.headers.authorization);

        if (!token) {
            res.sendStatus(HTTPCodes.FORBIDDEN);

            return;
        }

        const userStorage = new UserStorage(pool, mongoClient);

        const user = await userStorage.getByToken(token);

        if (!user) {
            res.sendStatus(HTTPCodes.FORBIDDEN);

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
