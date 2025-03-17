import { EntityFactory } from "./entityFactory";
import { EntityFactoriesProvider } from "../../middleware/entityFactoriesProvider.middleware";
import { LikeModel } from "../entities/likeModel.model";
import { LikeSchema } from "../../schema/like.schema";
import { ObjectId } from "mongodb";
import { Primitive } from "../../@types/Primitive";
import { UserModel } from "../entities/user.model";

export class LikeFactory extends EntityFactory<LikeModel> {
    public forPostFromUser(postId: Primitive, user: UserModel): LikeModel {
        return this.factory({
            id: new ObjectId().toHexString(),
            schema: {
                dt: new Date(),
                postId: ObjectId.createFromHexString(postId.toString()),
                usr: user.toMongodb(),
            },
        });
    }

    public getDefault(): LikeSchema {
        return {
            dt: new Date(),
            usr: EntityFactoriesProvider.getInstance().factories.mongodbUserFactory.getDefault(),
            postId: new ObjectId(),
        };
    }
}
