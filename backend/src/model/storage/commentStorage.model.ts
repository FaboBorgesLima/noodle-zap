import { ObjectId } from "mongodb";
import { CommentSchema } from "../../schema/comment.schema";
import { CommentModel } from "../comment.model";
import { ItemInDb } from "../itemInDb.model";
import { MongoDBStorage } from "./mongodbStorage.model";
import { CommentModelSchemaAdapter } from "../commentModelSchemaAdapter.model";
import { ItemInDbObjectId } from "../itemInDbObjectId.model";

export class CommentStorage extends MongoDBStorage<
    CommentModel,
    CommentSchema
> {
    protected readonly COLLECTION_NAME: string = "comments";
    async create(
        item: CommentModel
    ): Promise<void | ItemInDb<CommentModel, ObjectId>> {
        try {
            const result = await this.getCollection().insertOne(
                CommentModelSchemaAdapter.modelToSchema(item)
            );

            if (result.insertedId)
                return new ItemInDbObjectId(item, result.insertedId);
        } catch {}
    }
    async update(
        itemInDb: ItemInDb<CommentModel, ObjectId>
    ): Promise<void | ItemInDb<CommentModel, ObjectId>> {
        try {
            const result = await this.getCollection().replaceOne(
                { _id: itemInDb.getRawId() },
                CommentModelSchemaAdapter.modelToSchema(itemInDb.getItem())
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
    async getById(
        id: ObjectId
    ): Promise<void | ItemInDb<CommentModel, ObjectId>> {
        try {
            const result = await this.getCollection().findOne({ _id: id });

            if (result)
                return new ItemInDbObjectId(
                    CommentModelSchemaAdapter.schemaToModel(result),
                    result._id
                );
        } catch {}
    }
}
