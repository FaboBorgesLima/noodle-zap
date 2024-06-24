import { Request, Response } from "express";
import { UserStorage } from "../model/userStorage.model";
import { JsonValidator } from "../model/jsonValidator.model";
import { Validator } from "../model/validator.model";
import { UserModel } from "../model/user.model";
import { HashMaker } from "../model/hashMaker.model";
import { ItemInDb } from "../model/itemInDb.model";

export class UserController {
    constructor(private userStorage: UserStorage) {}

    async create(req: Request, res: Response) {
        const validator = new JsonValidator({
            email: Validator.validateEmail,
            password: Validator.validatePassword,
            name: Validator.validateName,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(400);
            return;
        }

        const user = UserModel.createFactory(
            validated.name,
            validated.email,
            validated.password
        );

        if (!user) {
            res.sendStatus(400);
            return;
        }

        const userInDb = await this.userStorage.create(user);

        if (!userInDb) {
            res.sendStatus(400);
            return;
        }

        res.json({ user: userInDb.getItem().toJson(), id: userInDb.getId() });
    }

    async login(req: Request, res: Response) {
        const validator = new JsonValidator({
            email: Validator.validateEmail,
            password: Validator.validatePassword,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(400);

            return;
        }

        const userInDb = await this.userStorage.getByEmailPassword(
            validated.email,
            HashMaker.make(validated.password)
        );

        if (!userInDb) {
            res.sendStatus(400);

            return;
        }

        res.status(200).json({
            user: userInDb.getItem().toJson(),
            id: userInDb.getId(),
        });
    }

    async loginViaToken(req: Request, res: Response) {
        const validator = new JsonValidator({
            token: Validator.validateStringLength(44),
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(400);
            return;
        }

        const userInDb = await this.userStorage.getByToken(validated.token);

        if (!userInDb) {
            res.sendStatus(400);
            return;
        }

        res.status(200).json({
            user: userInDb.getItem().toJson(),
            id: userInDb.getId(),
        });
    }

    async logout(
        req: Request,
        res: Response<any, { user: ItemInDb<UserModel> }>
    ) {
        const { user } = res.locals;

        user.getItem().randomizeToken();

        const newUser = await this.userStorage.update(user);

        if (newUser) {
            res.sendStatus(200);
            return;
        }

        res.sendStatus(400);
    }
}
