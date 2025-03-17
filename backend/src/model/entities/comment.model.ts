import { Validator } from "../helpers/validator.model";
import { TextSizes } from "../../enum/textSizes.enum";
import { Entity } from "../entities/entity.model";
import { CommentSchema } from "../../schema/comment.schema";
import { UserModel } from "./user.model";

export class CommentModel extends Entity<CommentSchema> {
    setText(text: string): boolean {
        const validated = Validator.validateStringLength(
            TextSizes.COMMENT_TEXT_MIN,
            TextSizes.COMMENT_TEXT_MAX
        )(text);

        if (!validated) return false;

        this.attributes.text = validated;

        return true;
    }

    public canUserDelete(user: UserModel): boolean {
        return user.id == this.attributes.usr.id.value;
    }

    getText(): string {
        return this.attributes.text;
    }

    getUser() {
        return this.attributes.usr;
    }

    getDate(): Date {
        return this.attributes.dt;
    }

    toJSON() {
        return {
            text: this.attributes.text,
            date: this.attributes.dt.getTime(),
            user: { ...this.attributes.usr },
            id: this.id,
        };
    }

    getPostId() {
        return this.id;
    }
}
