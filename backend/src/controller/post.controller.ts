import { Request, Response } from "express";
import { PostStorage } from "../model/postStorage.model";
import { UserModel } from "../model/user.model";
import { ItemInDb } from "../model/itemInDb.model";
import { JsonValidator } from "../model/jsonValidator.model";
import { Validator } from "../model/validator.model";
import { PostModel } from "../model/post.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";

export class PostController {
    constructor(private storage: PostStorage) {}

    async create(
        req: Request,
        res: Response<any, { user: ItemInDb<UserModel> }>
    ) {
        const validator = new JsonValidator({
            title: Validator.validateStringLength(3, 255),
            text: Validator.validateStringLength(3, 5000),
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(400);
            return;
        }

        const item = await this.storage.create(
            PostModel.create(
                validated.text,
                MongodbUserModelSchemaAdapter.userModelInDbToMongodbUserModel(
                    res.locals.user
                ),
                validated.title
            )
        );

        if (!item) {
            res.sendStatus(400);
            return;
        }

        res.json({ ...item.getItem().toJSON(), id: item.getId() });
    }
}
