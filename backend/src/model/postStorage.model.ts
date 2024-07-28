import { Db, MongoClient, ObjectId } from "mongodb";
import { CommonStorage } from "./commonStorage.model";
import { ItemInDb } from "./itemInDb.model";
import { PostModel } from "./post.model";
import { env } from "../config/env";
import { PostSchema } from "../schema/post.schema";
import { PostModelSchemaAdapter } from "./postModelSchemaAdapter.model";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

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
        this.db
            .collection<PostSchema>(this.collectionName)
            .updateOne(
                { _id: ObjectId.createFromHexString(itemInDb.getId()) },
                PostModelSchemaAdapter.modelToSchema(itemInDb.getItem())
            );
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async getById(id: string): Promise<ItemInDb<PostModel, ObjectId> | void> {
        const item = await this.db
            .collection<PostSchema>(this.collectionName)
            .findOne({ _id: ObjectId.createFromHexString(id) });

        if (!item) return;

        return new ItemInDbObjectId<PostModel>(
            PostModelSchemaAdapter.schemaToModel(item),
            item._id
        );
    }

    async getPage(
        page: number = 0,
        pageSize: number = 10,
        sortByDate: boolean = true
    ): Promise<ItemInDb<PostModel>[] | void> {
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
    }
}
