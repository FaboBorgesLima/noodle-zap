import { Int32, ObjectId } from "mongodb";
import { ItemInDbObjectId } from "../model/itemInDbObjectId.model";
import { CommentModel } from "../model/comment.model";
import { CommentStorage } from "../model/storage/commentStorage.model";
import { mongoClient } from "../connection/mongo";
import { PostStorage } from "../model/storage/postStorage.model";
import { MongodbUserModel } from "../model/mongodbUser.model";
import { ItemInDb } from "../model/itemInDb.model";

export class CommentController {
    private static postStorage = new PostStorage(mongoClient);
    private static commentStorage = new CommentStorage(mongoClient);

    static async create(
        postId: ObjectId,
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>
    ): Promise<void | ItemInDbObjectId<CommentModel>> {
        const post = await this.postStorage.getById(postId);

        if (!post) return;

        const comment = CommentModel.createFactory(text, user, postId);

        if (!comment) return;

        const commentInDb = await this.commentStorage.create(comment);

        if (!commentInDb) return;

        post.getItem().pushNewComment(commentInDb);

        await this.postStorage.update(post);

        return commentInDb;
    }
}
