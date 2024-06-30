import { CommentModel } from "./comment.model";
import { ItemInDb } from "./itemInDb.model";

export class PostModel {
    private comments: ItemInDb<CommentModel>[] = [];
    private constructor() {}
}
