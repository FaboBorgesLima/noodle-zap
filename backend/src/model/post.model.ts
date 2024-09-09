import { Int32, ObjectId } from "mongodb";
import { CommentModel } from "./comment.model";
import { HasJSON } from "./hasJson.interface";
import { ItemInDb } from "./itemInDb.model";
import { LikeModel } from "./likeModel.model";
import { MongodbUserModel } from "./mongodbUser.model";
import { CommentIndb } from "./commentInDb.model";
import { JsonValidator } from "./helpers/jsonValidator.model";
import { Validator } from "./helpers/validator.model";
import { TextSizes } from "../enum/textSizes.enum";
import { ItemInDbObjectId } from "./itemInDbObjectId.model";

export class PostModel implements HasJSON {
    private comments: CommentIndb[] = [];
    private likes: ItemInDbObjectId<LikeModel>[] = [];
    private title: string;
    private text: string;
    private user: ItemInDb<MongodbUserModel, Int32>;
    private date: Date;
    private nLikes: number;
    private nComments: number;
    private readonly COMMENT_MAX_ITEMS = 10;
    private readonly LIKES_MAX_ITEMS = 10;

    static textValidator = Validator.validateStringLength(
        TextSizes.POST_TEXT_MIN,
        TextSizes.POST_TEXT_MAX
    );

    static titleValidator = Validator.validateStringLength(
        TextSizes.POST_TITLE_MIN,
        TextSizes.POST_TEXT_MAX
    );

    private constructor(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string,
        date: Date,
        nLikes: number,
        nComments: number
    ) {
        this.text = text;
        this.title = title;
        this.user = user;
        this.date = date;
        this.nComments = nComments;
        this.nLikes = nLikes;
    }

    static factory(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string,
        date: Date,
        comments: ItemInDb<CommentModel, ObjectId>[],
        likes: ItemInDbObjectId<LikeModel>[],
        nLikes: number,
        nComments: number
    ): PostModel;
    /**
     *
     * @param text
     * @param user
     * @param title - needs to have
     *
     * # create factory
     *
     *  creates a new Post
     */
    static factory(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string
    ): PostModel | void;
    static factory(
        text: string,
        user: ItemInDb<MongodbUserModel, Int32>,
        title: string,
        date?: Date,
        comments?: ItemInDb<CommentModel, ObjectId>[],
        likes?: ItemInDbObjectId<LikeModel>[],
        nLikes?: number,
        nComments?: number
    ): PostModel | void {
        if (
            likes === undefined ||
            comments === undefined ||
            date === undefined ||
            nLikes === undefined ||
            nComments === undefined
        ) {
            const validator = new JsonValidator({
                text: this.textValidator,
                title: this.titleValidator,
            });

            const validated = validator.validate({ text, title });

            if (validated)
                return new PostModel(
                    validated.text,
                    user,
                    validated.title,
                    new Date(),
                    0,
                    0
                );

            return;
        }

        const post = new PostModel(text, user, title, date, nLikes, nComments);

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

    setText(text: string): boolean {
        const validated = PostModel.textValidator(text);

        if (!validated) {
            return false;
        }

        this.text = validated;

        return true;
    }

    getDate() {
        return this.date;
    }

    getTitle() {
        return this.title;
    }
    setTitle(title: string): boolean {
        const validated = PostModel.titleValidator(title);

        if (!validated) {
            return false;
        }

        this.title = validated;

        return true;
    }

    /**
     * # IMPORTANT
     *
     * you cant likes comments using this method, use setLikes for this
     */
    getLikes() {
        return [...this.likes];
    }

    setLikes(likes: ItemInDbObjectId<LikeModel>[]): boolean {
        if (likes.length > 10) return false;

        this.likes = likes;
        return true;
    }

    /**
     * # IMPORTANT
     *
     * you cant modify comments using this method, use setComments for this
     */
    getComments() {
        return [...this.comments];
    }

    setComments(comments: ItemInDbObjectId<CommentModel>[]): boolean {
        if (comments.length > 10) return false;

        this.comments = comments;
        return true;
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

    /**
     *
     * @param comment
     * @returns the oldest comment if necessary
     *
     *
     * push a new comment, return the oldest if there is more than 10 comments.
     *
     * will automatically increment the number of comments
     */
    pushNewComment(
        comment: ItemInDbObjectId<CommentModel>
    ): ItemInDbObjectId<CommentModel> | void {
        if (this.comments.length >= this.COMMENT_MAX_ITEMS) {
            const oldest = this.comments.shift();

            this.nComments++;

            this.comments.push(comment);

            return oldest;
        }
    }

    /**
     *
     * @param comment
     * @returns the oldest comment if necessary
     *
     *
     * push a new comment, return the oldest if there is more than 10 comments.
     *
     * will automatically increment the number of comments
     */
    pushNewLike(
        comment: ItemInDbObjectId<LikeModel>
    ): ItemInDbObjectId<LikeModel> | void {
        if (this.likes.length >= this.LIKES_MAX_ITEMS) {
            const oldest = this.likes.shift();

            this.nLikes++;

            this.likes.push(comment);

            return oldest;
        }
    }

    removeCommentById(commentId: ObjectId): boolean {
        for (let i = 0; i < this.comments.length; i++)
            if (
                this.comments[i].getRawId().toHexString() ==
                commentId.toHexString()
            ) {
                this.comments.splice(i, 1);
                return true;
            }

        return false;
    }

    removeLikeById(likeId: ObjectId): boolean {
        for (let i = 0; i < this.likes.length; i++)
            if (
                this.likes[i].getRawId().toHexString() == likeId.toHexString()
            ) {
                this.likes.splice(i, 1);
                return true;
            }

        return false;
    }

    getNComments() {
        return this.nComments;
    }

    getNLikes() {
        return this.nLikes;
    }
}
