import { Request } from "express";
import { mongoClient } from "../connection/mongo";
import { PostStorage } from "../model/storage/postStorage";
import { JsonValidator } from "../model/helpers/jsonValidator.model";
import { ResponseWithAuth } from "../middleware/auth.middleware";
import { Validator } from "../model/helpers/validator.model";
import { TextSizes } from "../enum/textSizes.enum";
import { HTTPCodes } from "../enum/httpCodes.enum";
import { CommentStorage } from "../model/storage/commentStorage";
import { rmSync } from "fs";

export class CommentRouteController {
    private static postStorage = new PostStorage(mongoClient);
    private static commentFactory = new CommentStorage(mongoClient);

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

        const factories = res.locals.entityFactoriesProvider.factories;

        const post = await factories.postFactory.findById(
            validated.postId.toHexString()
        );

        if (!post) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        const comment = factories.commentFactory.forPostFromUser(
            validated.postId.toHexString(),
            res.locals.user
        );

        comment.attributes.text = validated.text;

        const oldComment = post.pushNewComment(comment);

        if (oldComment) {
            oldComment.save();
        }

        await post.save();

        res.json(comment.toJSON());
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
        const { factories } = res.locals.entityFactoriesProvider;

        const [comment, post] = await Promise.all([
            factories.commentFactory.findById(
                validated.commentId.toHexString()
            ),
            factories.postFactory.findById(validated.postId.toHexString()),
        ]);

        if (comment) {
            if (comment.canUserDelete(res.locals.user)) {
                await comment.destroy();

                res.sendStatus(HTTPCodes.OK);
                return;
            }

            res.sendStatus(HTTPCodes.FORBIDDEN);
            return;
        }

        if (!post) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        const postIndex = post
            .getComments()
            .findIndex(
                (comment) =>
                    comment._id.toHexString() ==
                    validated.commentId.toHexString()
            );

        if (postIndex == -1) {
            res.sendStatus(HTTPCodes.NOT_FOUND);
            return;
        }

        if (post.getComments()[postIndex].usr.id.value != res.locals.user.id) {
            res.sendStatus(HTTPCodes.FORBIDDEN);
            return;
        }

        post.getComments().splice(postIndex, 1);

        const updated = await post.save();

        if (!updated) {
            res.sendStatus(HTTPCodes.FORBIDDEN);
            return;
        }

        res.sendStatus(HTTPCodes.OK);
    }
}
