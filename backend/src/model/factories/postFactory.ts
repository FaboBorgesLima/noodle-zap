import { UserSchema } from "../../schema/user.schema";
import { EntityFactory } from "./entityFactory";

import { PostModel } from "../entities/post.model";
import { PostSchema } from "../../schema/post.schema";
import { EntityFactoriesProvider } from "../../middleware/entityFactoriesProvider.middleware";
import { UserModel } from "../entities/user.model";

export class PostFactory extends EntityFactory<PostModel> {
    public fromUser(user: UserModel): PostModel {
        const schema = this.getDefault();

        schema.usr =
            EntityFactoriesProvider.getInstance().factories.mongodbUserFactory.fromUser(
                user
            ).attributes;

        return this.factory(schema);
    }

    public getDefault(): PostSchema {
        return {
            comments: [],
            dt: new Date(),
            likes: [],
            text: "",
            title: "",
            usr: EntityFactoriesProvider.getInstance().factories.mongodbUserFactory.getDefault(),
        };
    }
}
