import { Int32, MongoClient, ObjectId } from "mongodb";
import { ItemInDb } from "../itemInDb.model";
import { PostModel } from "../post.model";
import { PostSchema } from "../../schema/post.schema";
import { PostModelSchemaAdapter } from "../postModelSchemaAdapter.model";
import { ItemInDbObjectId } from "../itemInDbObjectId.model";
import { ItemInDbInt32 } from "../itemInDbInt32.model";
import { MongodbUserModelSchemaAdapter } from "../mongodbUserModelSchemaAdapter.model";
import { MongodbUserModel } from "../mongodbUser.model";
import { MongoDBStorage } from "./mongodbStorage.model";

export class PostStorage extends MongoDBStorage<PostModel, PostSchema> {
    protected readonly COLLECTION_NAME = "posts";

    constructor(protected mongoClient: MongoClient) {
        super(mongoClient);
    }

    async create(
        item: PostModel
    ): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            const insert = await this.getCollection().insertOne(
                PostModelSchemaAdapter.modelToSchema(item)
            );

            return new ItemInDbObjectId(item, insert.insertedId);
        } catch (e) {
            console.debug(e);
        }
    }
    async update(
        itemInDb: ItemInDb<PostModel, ObjectId>
    ): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            await this.getCollection().replaceOne(
                { _id: itemInDb.getRawId() },
                PostModelSchemaAdapter.modelToSchema(itemInDb.getItem())
            );
            return itemInDb;
        } catch {}
    }
    async delete(id: ObjectId): Promise<boolean> {
        try {
            const res = await this.getCollection().deleteOne({ _id: id });

            return res.acknowledged;
        } catch {}
        return false;
    }
    async getById(id: ObjectId): Promise<ItemInDb<PostModel, ObjectId> | void> {
        try {
            const item = await this.getCollection().findOne({ _id: id });

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
            const result = await this.getCollection().updateMany(
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

            const query = this.getCollection()
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

    async deletePostWhereUser(
        postId: ObjectId,
        userId: Int32
    ): Promise<boolean> {
        try {
            const couldDelete = await this.getCollection().deleteOne({
                _id: postId,
                "usr.id": userId,
            });

            return couldDelete.acknowledged;
        } catch {}

        return false;
    }

    async getPostsPageWhereUser(
        userId: Int32,
        page: number,
        pageSize: number
    ): Promise<ItemInDb<PostModel>[] | void> {
        try {
            const items: ItemInDb<PostModel>[] = [];

            const query = this.getCollection()
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
