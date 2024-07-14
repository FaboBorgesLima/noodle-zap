import { ObjectId } from "mongodb";
import { PostSchema } from "../schema/post.schema";
import { CommentModel } from "./comment.model";
import { ItemInDb } from "./itemInDb.model";
import { LikeModel } from "./likeModel.model";
import { MongodbUserModel } from "./mongodbUser.model";

export class PostModel {
    private comments: ItemInDb<CommentModel>[] = [];
    private likes: LikeModel[] = [];
    private title: string;
    private text: string;
    private user: ItemInDb<MongodbUserModel>;
    private date: Date;

    private constructor(
        text: string,
        user: ItemInDb<MongodbUserModel>,
        title: string,
        date: Date
    ) {
        this.text = text;
        this.title = title;
        this.user = user;
        this.date = date;
    }

    static load(
        text: string,
        user: ItemInDb<MongodbUserModel>,
        title: string,
        date: Date,
        comments: ItemInDb<CommentModel>[],
        likes: LikeModel[]
    ): PostModel {
        const post = new PostModel(text, user, title, date);

        post.comments = comments;
        post.likes = likes;
        return post;
    }

    static create(
        text: string,
        user: ItemInDb<MongodbUserModel>,
        title: string
    ): PostModel {
        return new PostModel(text, user, title, new Date());
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
}
