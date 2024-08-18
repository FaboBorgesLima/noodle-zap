import { Request, Response } from "express";
import { PostStorage } from "../model/storage/postStorage.model";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { PostModel } from "../model/post.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";
import { mongoClient } from "../connection/mongo";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { ResponseWithAuth } from "../middleware/auth.middleware";

export class PostController {
    constructor() {}

    private static storage = new PostStorage(mongoClient);

    static async create(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            title: Validator.validateStringLength(3, 255),
            text: Validator.validateStringLength(3, 5000),
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }
        const post = PostModel.factory(
            validated.text,
            MongodbUserModelSchemaAdapter.userModelInDbToMongodbUserModel(
                res.locals.user
            ),
            validated.title
        );

        if (!post) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const item = await this.storage.create(post);

        if (!item) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        res.json(item.toJSON());
    }

    static async getPage(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            page: Validator.validateUnsignInt,
            length: Validator.validateUnsignInt,
        });

        const validated = validator.validate(req.query);

        if (!validated) {
            res.send(HTTPCodes.BAD_REQUEST);
            return;
        }

        const posts = await this.storage.getPage(
            validated.page,
            validated.length
        );

        if (!posts) {
            res.send(HTTPCodes.SERVER_ERROR);
            return;
        }

        res.status(HTTPCodes.OK).json({
            posts: posts.map((post) => post.toJSON()),
        });
    }

    static async getById(req: Request, res: Response) {
        const validator = new JsonValidator({
            id: Validator.validateObjectIdHexString,
        });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const post = await this.storage.getById(validated.id);

        if (!post) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        res.status(HTTPCodes.OK).json(post.toJSON());
    }

    static async deletePost(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            id: Validator.validateObjectIdHexString,
        });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const couldDelete = await this.storage.deletePostFromUser(
            validated.id,
            res.locals.user.getRawId()
        );

        if (!couldDelete) {
            res.sendStatus(HTTPCodes.FORBIDDEN);
            return;
        }

        res.sendStatus(HTTPCodes.OK);
    }

    static async getUserPostsByPage(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            page: Validator.validateUnsignInt,
            pageSize: Validator.validateUnsignInt,
        });

        const validated = validator.validate(req.query);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const page = await this.storage.getUserPostsPage(
            res.locals.user.getRawId(),
            validated.page,
            validated.pageSize
        );

        if (!page) {
            res.sendStatus(HTTPCodes.SERVER_ERROR);
            return;
        }

        res.json({
            posts: page.map((post) => post.toJSON()),
        });
    }
}
