import { Request } from "express";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { ResponseEntityFactoriesProvider } from "../@types/ResponseEntityFactoriesProvider";

export class PostController {
    constructor() {
        //
    }

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

        const post =
            res.locals.entityFactoriesProvider.factories.postFactory.fromUser(
                res.locals.user
            );
        post.attributes.text = validated.text;
        post.attributes.title = validated.title;

        if (!post) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        if (!(await post.save())) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        res.json(post.toJSON());
    }

    static async getPage(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            page: Validator.validateUnsignInt,
            pageSize: Validator.validateUnsignInt,
        });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.send(HTTPCodes.BAD_REQUEST);
            return;
        }

        const posts =
            await res.locals.entityFactoriesProvider.factories.postFactory.paginate(
                validated.page,
                validated.pageSize
            );

        if (!posts) {
            res.send(HTTPCodes.SERVER_ERROR);
            return;
        }

        res.status(HTTPCodes.OK).json({
            posts: posts.map((post) => post.toJSON()),
        });
    }

    static async getById(req: Request, res: ResponseEntityFactoriesProvider) {
        const validator = new JsonValidator({
            id: Validator.validateObjectIdHexString,
        });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const post =
            await res.locals.entityFactoriesProvider.factories.postFactory.findById(
                validated.id.toHexString()
            );

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

        const post =
            await res.locals.entityFactoriesProvider.factories.postFactory.findById(
                validated.id.toHexString()
            );

        if (!post) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        console.debug(post, res.locals.user);
        if (!post.canUserDelete(res.locals.user)) {
            res.sendStatus(HTTPCodes.FORBIDDEN);
            return;
        }

        await post.destroy();

        res.sendStatus(HTTPCodes.OK);
    }

    static async getUserPostsByPage(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            page: Validator.validateUnsignInt,
            pageSize: Validator.validateUnsignInt,
            userId: Validator.validateInt32,
        });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const userPosts =
            await res.locals.entityFactoriesProvider.factories.postFactory.where(
                [
                    {
                        col: "usr",
                        operator: "=",
                        value: res.locals.user.toMongodb(),
                    },
                ]
            );

        res.json({
            posts: userPosts.map((post) => post.toJSON()),
        });
    }
}
