import { Int32 } from "mongodb";
import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModel } from "./mongodbUser.model";

export class LikeModel implements HasJSON {
    readonly user: ItemInDb<MongodbUserModel, Int32>;
    readonly date: Date;

    protected constructor(user: ItemInDb<MongodbUserModel, Int32>, date: Date) {
        this.user = user;
        this.date = date;
    }

    static load(user: ItemInDb<MongodbUserModel, Int32>, date: Date) {
        return new LikeModel(user, date);
    }
    static create(user: ItemInDb<MongodbUserModel, Int32>) {
        return new LikeModel(user, new Date());
    }

    toJSON() {
        return {
            user: this.user.getItem().toJSON(),
            date: this.date.getTime(),
        };
    }
}
