import { Db, Int32, MongoClient, ObjectId } from "mongodb";
import { CommonStorage } from "./commonStorage.model";
import { ItemInDb } from "../itemInDb.model";
import { PostModel } from "../post.model";
import { env } from "../../config/env";
import { PostSchema } from "../../schema/post.schema";
import { PostModelSchemaAdapter } from "../postModelSchemaAdapter.model";
import { ItemInDbObjectId } from "../itemInDbObjectId.model";
import { CommentModel } from "../comment.model";
import { CommentModelSchemaAdapter } from "../commentModelSchemaAdapter.model";
import { ItemInDbInt32 } from "../itemInDbInt32.model";
import { MongodbUserModelSchemaAdapter } from "../mongodbUserModelSchemaAdapter.model";
import { MongodbUserModel } from "../mongodbUser.model";

export class PostStorage extends CommonStorage<PostModel, ObjectId> {
    protected readonly COLLECTION_NAME = "posts";
    protected db: Db;
    constructor(protected mongoClient: MongoClient) {
        super();
        this.db = this.mongoClient.db(env.MONGO_INITDB_DATABASE);
    }

    async create(
        item: PostModel
    ): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            const insert = await this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .insertOne(PostModelSchemaAdapter.modelToSchema(item));

            return new ItemInDbObjectId(item, insert.insertedId);
        } catch (e) {
            console.debug(e);
        }
    }
    async update(
        itemInDb: ItemInDb<PostModel>
    ): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .updateOne(
                    { _id: ObjectId.createFromHexString(itemInDb.getId()) },
                    PostModelSchemaAdapter.modelToSchema(itemInDb.getItem())
                );
        } catch {}
    }
    async delete(id: ObjectId): Promise<boolean> {
        try {
            const res = await this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .deleteOne({ _id: id });

            return res.acknowledged;
        } catch {}
        return false;
    }
    async getById(id: ObjectId): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            const item = await this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .findOne({ _id: id });

            if (!item) return;

            return new ItemInDbObjectId<PostModel>(
                PostModelSchemaAdapter.schemaToModel(item),
                item._id
            );
        } catch {}
    }

    async updateUserInPosts(
        user: ItemInDbInt32<MongodbUserModel>
    ): Promise<boolean> {
        try {
            const result = await this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .updateMany(
                    { "usr.id": user.getRawId() },
                    MongodbUserModelSchemaAdapter.modelInDbToSchema(user)
                );

            return result.acknowledged;
        } catch {}
        return false;
    }

    async getPage(
        page: number = 0,
        pageSize: number = 10,
        sortByDate: boolean = true
    ): Promise<ItemInDb<PostModel>[] | void> {
        try {
            const items: ItemInDb<PostModel>[] = [];

            const query = this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .find()
                .skip(page * pageSize)
                .map(
                    (item) =>
                        new ItemInDbObjectId(
                            PostModelSchemaAdapter.schemaToModel(item),
                            item._id
                        )
                );

            if (sortByDate) {
                query.sort("dt", "desc");
            }

            let item = await query.tryNext();

            for (let i = 0; i < pageSize && item; i++) {
                items.push(item);

                item = await query.tryNext();
            }

            return items;
        } catch {}
    }

    async addComment(
        comment: CommentModel,
        postId: ObjectId
    ): Promise<ItemInDb<CommentModel, ObjectId> | void> {
        const itemInDb = new ItemInDbObjectId(comment, new ObjectId());

        const insert = await this.db
            .collection<PostSchema>(this.COLLECTION_NAME)
            .updateOne(
                { _id: postId },
                {
                    $push: {
                        comments:
                            CommentModelSchemaAdapter.modelInDbToSchema(
                                itemInDb
                            ),
                    },
                }
            );
        if (insert.acknowledged) {
            return itemInDb;
        }
    }

    async deletePostFromUser(
        postId: ObjectId,
        userId: Int32
    ): Promise<boolean> {
        try {
            const couldDelete = await this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .deleteOne({
                    _id: postId,
                    "usr.id": userId,
                });

            return couldDelete.acknowledged;
        } catch {}

        return false;
    }

    async deleteCommentFromPostAndUser(
        commentId: ObjectId,
        postId: ObjectId,
        userId: Int32
    ): Promise<boolean> {
        try {
            const res = await this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .updateOne(
                    {
                        _id: postId,
                        comments: {
                            $elemMatch: { "usr.id": userId, _id: commentId },
                        },
                    },
                    {
                        $pull: {
                            comments: { _id: commentId },
                        },
                    }
                );

            return res.modifiedCount == 1;
        } catch {}
        return false;
    }

    async getUserPostsPage(
        userId: Int32,
        page: number,
        pageSize: number
    ): Promise<ItemInDb<PostModel>[] | void> {
        try {
            const items: ItemInDb<PostModel>[] = [];

            const query = this.db
                .collection<PostSchema>(this.COLLECTION_NAME)
                .find({ "usr.id": userId })
                .sort("dt", "desc")
                .skip(page * pageSize)
                .map(
                    (item) =>
                        new ItemInDbObjectId(
                            PostModelSchemaAdapter.schemaToModel(item),
                            item._id
                        )
                );

            let item = await query.tryNext();

            for (let i = 0; i < pageSize && item; i++) {
                items.push(item);

                item = await query.tryNext();
            }

            return items;
        } catch {}
    }
}
