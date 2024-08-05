import { Request, Response } from "express";
import { UserStorage } from "../model/storage/userStorage.model";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { UserModel } from "../model/user.model";
import { HashMaker } from "../model/helpers/hashMaker.model";
import { ItemInDb } from "../model/itemInDb.model";
import { connPoll } from "../connection/mysql";
import { HTTPCodes } from "../enum/httpCodes.enum";

export class UserController {
    private static conn = connPoll.getConnection();

    private static async getUserStorage(): Promise<UserStorage> {
        return new UserStorage(await this.conn);
    }

    static async create(req: Request, res: Response) {
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

        const user = UserModel.createFactory(
            validated.name,
            validated.email,
            validated.password
        );

        if (!user) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const userInDb = await (await this.getUserStorage()).create(user);

        if (!userInDb) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        res.json({ user: userInDb.getItem().toJSON(), id: userInDb.getId() });
    }

    static async login(req: Request, res: Response) {
        const validator = new JsonValidator({
            email: Validator.validateEmail,
            password: Validator.validatePassword,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);

            return;
        }

        const userInDb = await (
            await this.getUserStorage()
        ).getByEmailPassword(
            validated.email,
            HashMaker.make(validated.password)
        );

        if (!userInDb) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);

            return;
        }

        res.status(200).json({
            user: userInDb.getItem().toJSON(),
            id: userInDb.getId(),
        });
    }

    static async findByName(req: Request, res: Response) {
        const validator = new JsonValidator({ name: Validator.validateName });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const user = await (
            await this.getUserStorage()
        ).getByName(validated.name);

        if (!user) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        res.json({ id: user.getId(), name: user.getItem().getName() });
    }

    static async loginViaToken(req: Request, res: Response) {
        const validator = new JsonValidator({
            token: Validator.validateStringLength(44),
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const userInDb = await (
            await this.getUserStorage()
        ).getByToken(validated.token);

        if (!userInDb) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        res.status(200).json({
            user: userInDb.getItem().toJSON(),
            id: userInDb.getId(),
        });
    }

    static async logout(
        req: Request,
        res: Response<any, { user: ItemInDb<UserModel, number> }>
    ) {
        const { user } = res.locals;

        user.getItem().randomizeToken();

        const newUser = await (await this.getUserStorage()).update(user);

        if (newUser) {
            res.sendStatus(HTTPCodes.OK);
            return;
        }

        res.sendStatus(HTTPCodes.BAD_REQUEST);
    }
}
