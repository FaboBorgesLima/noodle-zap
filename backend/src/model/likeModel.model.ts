import { ItemInDb } from "./itemInDb.model";
import { MongodbUserModel } from "./mongodbUser.model";

export class LikeModel {
    readonly user: ItemInDb<MongodbUserModel>;
    readonly date: Date;

    protected constructor(user: ItemInDb<MongodbUserModel>, date: Date) {
        this.user = user;
        this.date = date;
    }

    static load(user: ItemInDb<MongodbUserModel>, date: Date) {
        return new LikeModel(user, date);
    }
}
