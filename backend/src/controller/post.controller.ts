import { Request, Response } from "express";
import { PostStorage } from "../model/storage/postStorage.model";
import { UserModel } from "../model/user.model";
import { ItemInDb } from "../model/itemInDb.model";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { PostModel } from "../model/post.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";
import { mongoClient } from "../connection/mongo";

export class PostController {
    constructor() {}

    private static storage = new PostStorage(mongoClient);

    static async create(
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
            PostModel.factory(
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

        res.json(item.toJSON());
    }

    static async getPage(
        req: Request,
        res: Response<any, { user: ItemInDb<UserModel> }>
    ) {
        const validator = new JsonValidator({
            page: Validator.validateUnsignInt,
            length: Validator.validateUnsignInt,
        });

        const validated = validator.validate(req.query);

        if (!validated) {
            res.send(400);
            return;
        }

        const posts = await this.storage.getPage(
            validated.page,
            validated.length
        );

        if (!posts) {
            res.send(500);
            return;
        }

        res.json({
            posts: posts.map((post) => post.toJSON()),
        });
    }
}
