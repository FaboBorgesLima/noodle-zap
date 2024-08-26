import { Request } from "express";
import { mongoClient } from "../connection/mongo";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { PostStorage } from "../model/storage/postStorage.model";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { LikeModel } from "../model/likeModel.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";

export class LikeController {
    private static storage = new PostStorage(mongoClient);

    static async create(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            postId: Validator.validateObjectIdHexString,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const like = LikeModel.create(
            MongodbUserModelSchemaAdapter.userModelInDbToMongodbUserModel(
                res.locals.user
            )
        );

        const couldLike = await this.storage.addLike(validated.postId, like);

        if (couldLike) {
            res.sendStatus(HTTPCodes.OK);
            return;
        }

        res.sendStatus(HTTPCodes.NOT_FOUND);
    }
}
