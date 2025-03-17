import { NextFunction, Request, Response } from "express";
import { BearerToken } from "../model/helpers/bearerToken.model";
import { UserModel } from "../model/entities/user.model";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { ResponseEntityFactoriesProvider } from "../@types/ResponseEntityFactoriesProvider";

export class Auth {
    static async middleware(
        req: Request,
        res: ResponseWithAuth,
        next: NextFunction
    ): Promise<void> {
        const token = BearerToken.getToken(req.headers.authorization);

        if (!token) {
            res.sendStatus(HTTPCodes.FORBIDDEN);

            return;
        }

        const userFactory =
            res.locals.entityFactoriesProvider.factories.userFactory;

        const users = await userFactory.where([
            { col: "token", operator: "=", value: token },
        ]);

        if (users.length != 1) {
            res.sendStatus(HTTPCodes.FORBIDDEN);

            return;
        }

        const [user] = users;

        res.locals.user = user;

        next();
    }
}
export interface ResponseWithAuth
    extends ResponseEntityFactoriesProvider<{ user: UserModel }> {}
