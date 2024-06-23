import { Request, Response } from "express";
import { UserStorage } from "../model/userStorage.model";
import { JsonValidator } from "../model/jsonValidator.model";
import { Validator } from "../model/validator.model";
import { UserModel } from "../model/user.model";

export class UserController {
    constructor(private userStorage: UserStorage) {}

    async create(req: Request, res: Response) {
        const validated = JsonValidator.validate(
            {
                email: Validator.validateEmail,
                password: Validator.validatePassword,
                name: Validator.validateName,
            },
            req.body
        );

        if (!validated) {
            res.sendStatus(400);
            return;
        }

        validated.email;

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

        res.status(200).json({
            id: userInDb.getId(),
            token: userInDb.getItem().getToken(),
        });
    }
}
