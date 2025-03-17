import { Request, Response } from "express";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { HashMaker } from "../model/helpers/hashMaker.model";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { ResponseEntityFactoriesProvider } from "../@types/ResponseEntityFactoriesProvider";
import { RandomTokenMaker } from "../model/helpers/randomTokenMaker.model";
import { ResponseWithAuth } from "../middleware/auth.middleware";

export class UserController {
    static async create(req: Request, res: ResponseEntityFactoriesProvider) {
        const validator = new JsonValidator({
            email: Validator.validateEmail,
            password: Validator.validatePassword,
            name: Validator.validateName,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }
        const userFactory =
            res.locals.entityFactoriesProvider.factories.userFactory;

        const user = userFactory.factory({
            name: validated.name,
            email: validated.email,
            password: HashMaker.make(validated.password),
            token: RandomTokenMaker.make(),
        });

        try {
            user.save();
        } catch {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        res.json({ user: user.toJSON() });
    }

    static async login(req: Request, res: ResponseEntityFactoriesProvider) {
        const validator = new JsonValidator({
            email: Validator.validateEmail,
            password: Validator.validatePassword,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);

            return;
        }

        const users =
            await res.locals.entityFactoriesProvider.factories.userFactory.where(
                [
                    { col: "email", operator: "=", value: validated.email },
                    {
                        col: "password",
                        operator: "=",
                        value: HashMaker.make(validated.password),
                    },
                ]
            );

        if (!users) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);

            return;
        }

        const [user] = users;

        res.status(HTTPCodes.OK).json({
            user: user.toJSON(),
        });
    }

    static async findByName(
        req: Request,
        res: ResponseEntityFactoriesProvider
    ) {
        const validator = new JsonValidator({ name: Validator.validateName });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const users =
            await res.locals.entityFactoriesProvider.factories.userFactory.where(
                [{ col: "name", operator: "=", value: validated.name }]
            );

        if (!users) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }
        const [user] = users;

        res.json({ id: user.id, name: user.getName() });
    }

    static async loginViaToken(
        req: Request,
        res: ResponseEntityFactoriesProvider
    ) {
        const validator = new JsonValidator({
            token: Validator.validateStringLength(44),
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const users =
            await res.locals.entityFactoriesProvider.factories.userFactory.where(
                [{ col: "token", operator: "=", value: validated.token }]
            );

        if (!users) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const [user] = users;

        res.status(200).json({
            user: user.toJSON(),
            id: user.id,
        });
    }

    static async logout(req: Request, res: ResponseWithAuth) {
        const { user } = res.locals;

        let couldSave = false;

        try {
            couldSave = await user.randomizeToken().save();
        } catch {
            res.sendStatus(HTTPCodes.SERVER_ERROR);
            return;
        }

        if (couldSave) {
            res.sendStatus(HTTPCodes.OK);
            return;
        }

        res.sendStatus(HTTPCodes.BAD_REQUEST);
    }
}
