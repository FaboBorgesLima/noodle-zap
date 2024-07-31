import { Int32, ObjectId } from "mongodb";
import { CommentModel } from "./comment.model";
import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";
import { LikeModel } from "./likeModel.model";
import { MongodbUserModel } from "./mongodbUser.model";
import { CommentIndb } from "./commentInDb.model";

export class PostModel implements HasJSON {
    private comments: CommentIndb[] = [];
    private likes: LikeModel[] = [];
    private title: string;
    private text: string;
    private user: ItemInDb<MongodbUserModel, Int32>;
    private date: Date;

    private constructor(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string,
        date: Date
    ) {
        this.text = text;
        this.title = title;
        this.user = user;
        this.date = date;
    }

    static factory(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string,
        date: Date,
        comments: ItemInDb<CommentModel, ObjectId>[],
        likes: LikeModel[]
    ): PostModel;
    static factory(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string
    ): PostModel;
    static factory(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string,
        date?: Date,
        comments?: ItemInDb<CommentModel, ObjectId>[],
        likes?: LikeModel[]
    ): PostModel {
        if (
            likes === undefined ||
            comments === undefined ||
            date === undefined
        ) {
            return new PostModel(text, user, title, new Date());
        }

        const post = new PostModel(text, user, title, date);

        post.comments = comments;
        post.likes = likes;
        return post;
    }

    getUser() {
        return this.user;
    }

    getText() {
        return this.text;
    }

    getDate() {
        return this.date;
    }

    getTitle() {
        return this.title;
    }

    getLikes() {
        return this.likes;
    }

    getComments() {
        return this.comments;
    }

    toJSON() {
        return {
            text: this.text,
            title: this.title,
            comments: this.comments.map((comment) => comment.toJSON()),
            likes: this.likes.map((like) => like.toJSON()),
            date: this.date.getTime(),
            user: { ...this.user.getItem().toJSON(), id: this.user.getId() },
        };
    }
}
