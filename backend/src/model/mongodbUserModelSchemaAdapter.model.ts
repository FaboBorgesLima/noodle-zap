import { Int32 } from "mongodb";
import { MongodbUserSchema } from "../schema/mongodbUser.schema";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModel } from "./mongodbUser.model";

export class MongodbUserModelSchemaAdapter {
    static modelInDbToSchema(
        model: ItemInDb<MongodbUserModel>
    ): MongodbUserSchema {
        return {
            email: model.getItem().email,
            name: model.getItem().name,
            id: new Int32(model.getId()),
        };
    }

    static schemaToModelInDb(
        schema: MongodbUserSchema
    ): ItemInDb<MongodbUserModel> {
        return new ItemInDb<MongodbUserModel>(
            MongodbUserModel.factory(schema.name, schema.email),
            schema.id.toString()
        );
    }
}
