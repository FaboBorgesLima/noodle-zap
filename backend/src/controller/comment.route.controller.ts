import { Request } from "express";
import { mongoClient } from "../connection/mongo";
import { PostStorage } from "../model/storage/postStorage.model";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { Validator } from "../model/helpers/validator.model";
import { TextSizes } from "../enum/textSizes.enum";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";
import { CommentStorage } from "../model/storage/commentStorage.model";
import { CommentController } from "./comment.controller";

export class CommentRouteController {
    private static postStorage = new PostStorage(mongoClient);
    private static commentStorage = new CommentStorage(mongoClient);

    static async create(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            text: Validator.validateStringLength(
                TextSizes.COMMENT_TEXT_MIN,
                TextSizes.COMMENT_TEXT_MAX
            ),
            postId: Validator.validateObjectIdHexString,
        });

        const validated = validator.validate(req.body);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const commentInDb = await CommentController.create(
            validated.postId,
            validated.text,
            MongodbUserModelSchemaAdapter.userModelInDbToMongodbUserModel(
                res.locals.user
            )
        );

        if (!commentInDb) {
            res.sendStatus(HTTPCodes.SERVER_ERROR);
            return;
        }

        res.json(commentInDb.toJSON());
    }

    static async delete(req: Request, res: ResponseWithAuth) {
        const validator = new JsonValidator({
            postId: Validator.validateObjectIdHexString,
            commentId: Validator.validateObjectIdHexString,
        });

        const validated = validator.validate(req.params);

        if (!validated) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const postInDb = await this.postStorage.getById(validated.postId);

        if (!postInDb) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        const postIndex = postInDb
            .getItem()
            .getComments()
            .findIndex(
                (comment) =>
                    comment.getRawId().toHexString() ==
                    validated.commentId.toHexString()
            );

        if (postIndex == -1) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        postInDb.getItem().getComments().splice(postIndex, 1);

        const updated = await this.postStorage.update(postInDb);

        if (!updated) {
            res.sendStatus(HTTPCodes.FORBIDDEN);
            return;
        }

        res.sendStatus(HTTPCodes.OK);
    }
}
