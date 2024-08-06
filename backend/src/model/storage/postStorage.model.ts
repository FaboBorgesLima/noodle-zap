import { Db, MongoClient, ObjectId } from "mongodb";
import { CommonStorage } from "./commonStorage.model";
import { ItemInDb } from "../itemInDb.model";
import { PostModel } from "../post.model";
import { env } from "../../config/env";
import { PostSchema } from "../../schema/post.schema";
import { PostModelSchemaAdapter } from "../postModelSchemaAdapter.model";
import { ItemInDbObjectId } from "../itemInDbObjectId.model";
import { CommentModel } from "../comment.model";
import { CommentModelSchemaAdapter } from "../commentModelSchemaAdapter.model";

export class PostStorage extends CommonStorage<PostModel, ObjectId> {
    protected readonly collectionName = "posts";
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
                .collection<PostSchema>(this.collectionName)
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
                .collection<PostSchema>(this.collectionName)
                .updateOne(
                    { _id: ObjectId.createFromHexString(itemInDb.getId()) },
                    PostModelSchemaAdapter.modelToSchema(itemInDb.getItem())
                );
        } catch {}
    }
    async delete(id: ObjectId): Promise<boolean> {
        try {
            const res = await this.db
                .collection<PostSchema>(this.collectionName)
                .deleteOne({ _id: id });

            return res.acknowledged;
        } catch {}
        return false;
    }
    async getById(id: ObjectId): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            const item = await this.db
                .collection<PostSchema>(this.collectionName)
                .findOne({ _id: id });

            if (!item) return;

            return new ItemInDbObjectId<PostModel>(
                PostModelSchemaAdapter.schemaToModel(item),
                item._id
            );
        } catch {}
    }

    async getPage(
        page: number = 0,
        pageSize: number = 10,
        sortByDate: boolean = true
    ): Promise<ItemInDb<PostModel>[] | void> {
        try {
            const items: ItemInDb<PostModel>[] = [];

            const query = this.db
                .collection<PostSchema>(this.collectionName)
                .find()
                .skip(page * pageSize);

            if (sortByDate) {
                query.sort("dt", "desc");
            }

            let item = await query.tryNext();

            for (let i = 0; i < pageSize && item; i++) {
                items.push(
                    new ItemInDbObjectId(
                        PostModelSchemaAdapter.schemaToModel(item),
                        item._id
                    )
                );

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
            .collection<PostSchema>(this.collectionName)
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
}
