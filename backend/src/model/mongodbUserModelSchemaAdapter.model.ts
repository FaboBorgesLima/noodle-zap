import { Int32 } from "mongodb";
import { MongodbUserSchema } from "../schema/mongodbUser.schema";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModel } from "./mongodbUser.model";
import { UserModel } from "./user.model";
import { ItemInDbInt32 } from "./itemInDbInt32.model";

export class MongodbUserModelSchemaAdapter {
    static modelInDbToSchema(
        model: ItemInDb<MongodbUserModel, Int32>
    ): MongodbUserSchema {
        return {
            email: model.getItem().email,
            name: model.getItem().name,
            id: model.getRawId(),
        };
    }

    static schemaToModelInDb(
        schema: MongodbUserSchema
    ): ItemInDb<MongodbUserModel, Int32> {
        return new ItemInDbInt32<MongodbUserModel>(
            MongodbUserModel.factory(schema.name, schema.email),
            schema.id
        );
    }

    static userModelInDbToMongodbUserModel(
        userModel: ItemInDb<UserModel, any>
    ): ItemInDb<MongodbUserModel, Int32> {
        return new ItemInDbInt32<MongodbUserModel>(
            MongodbUserModel.fromUser(userModel.getItem()),
            new Int32(userModel.getId())
        );
    }
}
