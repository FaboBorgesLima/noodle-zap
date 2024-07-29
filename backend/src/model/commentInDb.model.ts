import { CommentModel } from "./comment.model";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

export class CommentIndb<
    T extends CommentModel = CommentModel
> extends ItemInDbObjectId<T> {
    override toJSON(): object {
        return {
            id: this.getId(),
            text: this.item.getText(),
            date: this.item.getDate().getTime(),
            user: {
                ...this.item.getUser().getItem().toJSON(),
                id: this.item.getUser().getId(),
            },
        };
    }
}
