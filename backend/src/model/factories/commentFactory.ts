import { EntityFactory } from "./entityFactory";
import { CommentModel } from "../entities/comment.model";
import { CommentSchema } from "../../schema/comment.schema";
import { ObjectId } from "mongodb";
import { EntityFactoriesProvider } from "../../middleware/entityFactoriesProvider.middleware";
import { UserModel } from "../entities/user.model";
import { Primitive } from "../../@types/Primitive";

export class CommentFactory extends EntityFactory<CommentModel> {
    public forPostFromUser(postid: Primitive, user: UserModel): CommentModel {
        return this.factory({
            schema: {
                dt: new Date(),
                post: ObjectId.createFromHexString(postid.toString()),
                text: "",
                usr: EntityFactoriesProvider.getInstance().factories.mongodbUserFactory.fromUser(
                    user
                ).attributes,
            },
            id: new ObjectId().toHexString(),
        });
    }

    public getDefault(): CommentSchema {
        return {
            dt: new Date(),
            post: new ObjectId(),
            text: "",
            usr: EntityFactoriesProvider.getInstance().factories.mongodbUserFactory.getDefault(),
        };
    }
}
