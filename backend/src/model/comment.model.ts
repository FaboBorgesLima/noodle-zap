import { Validator } from "./helpers/validator.model";
import { MongodbUserModel } from "./mongodbUser.model";
import { ItemInDb } from "./itemInDb.model";
import { HasJSON } from "./hasJson.interface";
import { Int32, ObjectId } from "mongodb";
import { TextSizes } from "../enum/textSizes.enum";

export class CommentModel implements HasJSON {
    protected constructor(
        private text: string,
        private user: ItemInDb<MongodbUserModel, Int32>,
        private date: Date,
        private postId: ObjectId
    ) {}

    static loadFactory(
        text: string,
        mongoUser: ItemInDb<MongodbUserModel, Int32>,
        date: Date,
        postId: ObjectId
    ): CommentModel {
        const comment = new CommentModel(text, mongoUser, date, postId);

        return comment;
    }

    static createFactory(
        text: string,
        mongoUser: ItemInDb<MongodbUserModel, Int32>,
        postId: ObjectId
    ): CommentModel | void {
        const comment = new CommentModel(text, mongoUser, new Date(), postId);

        if (comment.setText(text)) return comment;
    }

    setText(text: string): boolean {
        const validated = Validator.validateStringLength(
            TextSizes.COMMENT_TEXT_MIN,
            TextSizes.COMMENT_TEXT_MAX
        )(text);

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
    getPostId() {
        return this.postId;
    }
}
