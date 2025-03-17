import { Request } from "express";
import { mongoClient } from "../connection/mongo";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { Validator } from "../model/helpers/validator.model";
import { PostStorage } from "../model/storage/postStorage";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { LikeModel } from "../model/entities/likeModel.model";
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

        const { factories } = res.locals.entityFactoriesProvider;

        const post = await factories.postFactory.findById(
            validated.postId.toHexString()
        );

        if (!post) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        const like = factories.likeFactory.forPostFromUser(
            post.id ?? "",
            res.locals.user
        );

        const oldLike = post.pushNewLike(like);

        if (oldLike) {
            await oldLike.save();
        }

        const updated = await post.save();

        if (updated) {
            res.sendStatus(HTTPCodes.OK);
            return;
        }

        res.sendStatus(HTTPCodes.NOT_FOUND);
    }
}
