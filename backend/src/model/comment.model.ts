import { Int32 } from "mongodb";
import { Validator } from "./validator.model";

export class CommentModel {
    protected constructor(
        private text: string,
        private userName: string,
        private userId: Int32
    ) {}

    static loadFactory(
        userName: string,
        userId: Int32,
        text: string
    ): void | CommentModel {
        const comment = new CommentModel("", "", userId);

        if (comment.setText(text) && comment.setUserName(userName))
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

    setUserName(userName: string): boolean {
        const validated = Validator.validateName(userName);

        if (!validated) return false;

        this.userName = validated;

        return true;
    }

    getUserName(): string {
        return this.userName;
    }

    setUserId(userId: Int32) {
        this.userId = userId;
    }

    getUserId(): Int32 {
        return this.userId;
    }
}
