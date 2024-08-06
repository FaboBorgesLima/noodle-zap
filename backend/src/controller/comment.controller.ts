import { Request } from "express";
import { mongoClient } from "../connection/mongo";
import { PostStorage } from "../model/storage/postStorage.model";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { Validator } from "../model/helpers/validator.model";
import { TextSizes } from "../enum/textSizes.enum";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { CommentModel } from "../model/comment.model";
import { MongodbUserModelSchemaAdapter } from "../model/mongodbUserModelSchemaAdapter.model";

export class CommentControler {
    private static storage = new PostStorage(mongoClient);

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

        const comment = CommentModel.createFactory(
            validated.text,
            MongodbUserModelSchemaAdapter.userModelInDbToMongodbUserModel(
                res.locals.user
            )
        );

        if (!comment) {
            res.sendStatus(HTTPCodes.BAD_REQUEST);
            return;
        }

        const commentInDb = await this.storage.addComment(
            comment,
            validated.postId
        );

        if (!commentInDb) {
            res.sendStatus(HTTPCodes.SERVER_ERROR);
            return;
        }

        res.json(commentInDb.toJSON());
    }
}
