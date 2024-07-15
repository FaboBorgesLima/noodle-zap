import { Int32 } from "mongodb";
import { Validator } from "./validator.model";
import { MongodbUserModel } from "./mongodbUser.model";
import { ItemInDb } from "./itemInDb.model";

export class CommentModel {
    protected constructor(
        private text: string,
        private user: ItemInDb<MongodbUserModel>,
        private date: Date
    ) {}

    static loadFactory(
        text: string,
        mongoUser: ItemInDb<MongodbUserModel>,
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
