import { Validator } from "./helpers/validator.model";
import { MongodbUserModel } from "./mongodbUser.model";
import { ItemInDb } from "./itemInDb.model";
import { HasJSON } from "./hasJson.interface";
import { Int32 } from "mongodb";

export class CommentModel implements HasJSON {
    protected constructor(
        private text: string,
        private user: ItemInDb<MongodbUserModel, Int32>,
        private date: Date
    ) {}

    static loadFactory(
        text: string,
        mongoUser: ItemInDb<MongodbUserModel, Int32>,
        date: Date
    ): CommentModel {
        const comment = new CommentModel(text, mongoUser, date);

        comment.setText(text);
        return comment;
    }

    setText(text: string): boolean {
        const validated = Validator.validateStringLength(3, 5000)(text);

        if (!validated) return false;

        this.text = validated;

        return true;
    }

    getText(): string {
        return this.text;
    }

    getUser() {
        return this.user;
    }

    getDate(): Date {
        return this.date;
    }

    toJSON() {
        return {
            text: this.text,
            date: this.date.getTime(),
            user: { ...this.user.getItem().toJSON(), id: this.user.getId() },
        };
    }
}
