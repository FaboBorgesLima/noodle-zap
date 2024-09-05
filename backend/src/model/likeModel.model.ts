import { Int32, ObjectId } from "mongodb";
import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModel } from "./mongodbUser.model";

export class LikeModel implements HasJSON {
    readonly user: ItemInDb<MongodbUserModel, Int32>;
    readonly date: Date;
    readonly postId: ObjectId;

    protected constructor(
        user: ItemInDb<MongodbUserModel, Int32>,
        date: Date,
        postId: ObjectId
    ) {
        this.user = user;
        this.date = date;
        this.postId = postId;
    }

    static load(
        user: ItemInDb<MongodbUserModel, Int32>,
        date: Date,
        postId: ObjectId
    ) {
        return new LikeModel(user, date, postId);
    }
    static create(user: ItemInDb<MongodbUserModel, Int32>, postId: ObjectId) {
        return new LikeModel(user, new Date(), postId);
    }

    toJSON() {
        return {
            user: this.user.getItem().toJSON(),
            date: this.date.getTime(),
        };
    }
}
