import { ObjectId } from "mongodb";
import { LikeSchema } from "../../schema/like.schema";
import { ItemInDb } from "../itemInDb.model";
import { LikeModel } from "../likeModel.model";
import { MongoDBStorage } from "./mongodbStorage.model";
import { LikeModelSchemaAdapter } from "../likeModelSchemaAdapter.model";
import { ItemInDbObjectId } from "../itemInDbObjectId.model";

export class LikeStorage extends MongoDBStorage<LikeModel, LikeSchema> {
    protected readonly COLLECTION_NAME: string = "likes";
    async create(
        item: LikeModel
    ): Promise<void | ItemInDb<LikeModel, ObjectId>> {
        try {
            const result = await this.getCollection().insertOne(
                LikeModelSchemaAdapter.modelToSchema(item)
            );

            return new ItemInDbObjectId(item, result.insertedId);
        } catch {}
    }
    async update(
        itemInDb: ItemInDb<LikeModel, ObjectId>
    ): Promise<void | ItemInDb<LikeModel, ObjectId>> {
        try {
            const result = await this.getCollection().replaceOne(
                {
                    _id: itemInDb.getRawId(),
                },
                LikeModelSchemaAdapter.modelToSchema(itemInDb.getItem())
            );
            if (result.modifiedCount > 0) return itemInDb;
        } catch {}
    }
    async delete(id: ObjectId): Promise<boolean> {
        try {
            const result = await this.getCollection().deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch {}
        return false;
    }
    async getById(id: ObjectId): Promise<void | ItemInDb<LikeModel, ObjectId>> {
        try {
            const find = await this.getCollection().findOne({ _id: id });

            if (!find) return;

            return new ItemInDbObjectId(
                LikeModelSchemaAdapter.schemaToModel(find),
                find._id
            );
        } catch {}
    }
}
