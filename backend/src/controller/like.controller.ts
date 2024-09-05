import { Request } from "express";
import { mongoClient } from "../connection/mongo";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { PostStorage } from "../model/storage/postStorage.model";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { LikeModel } from "../model/likeModel.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";
import { ItemInDbObjectId } from "../model/itemInDbObjectId.model";
import { ObjectId } from "mongodb";

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
            ),
            validated.postId
        );

        const postInDb = await this.storage.getById(validated.postId);

        if (!postInDb) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        const likeInDb = new ItemInDbObjectId(like, new ObjectId());

        postInDb.getItem().getLikes().push(likeInDb);

        const updated = await this.storage.update(postInDb);

        if (updated) {
            res.sendStatus(HTTPCodes.OK);
            return;
        }

        res.sendStatus(HTTPCodes.NOT_FOUND);
    }
}
