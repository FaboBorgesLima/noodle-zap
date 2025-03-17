import { ObjectId } from "mongodb";
import { CommentModel } from "./comment.model";
import { LikeModel } from "./likeModel.model";
import { Validator } from "../helpers/validator.model";
import { TextSizes } from "../../enum/textSizes.enum";
import { Entity } from "./entity.model";
import { PostSchema } from "../../schema/post.schema";
import { UserModel } from "./user.model";

export class PostModel extends Entity<PostSchema> {
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

    getUser() {
        return this.attributes.usr;
    }

    getText() {
        return this.attributes.text;
    }

    setText(text: string): boolean {
        const validated = PostModel.textValidator(text);

        if (!validated) {
            return false;
        }

        this.attributes.text = validated;

        return true;
    }

    getDate() {
        return this.attributes.dt;
    }

    getTitle() {
        return this.attributes.title;
    }

    setTitle(title: string): boolean {
        const validated = PostModel.titleValidator(title);

        if (!validated) {
            return false;
        }

        this.attributes.title = validated;

        return true;
    }

    /**
     * # IMPORTANT
     *
     * you cant likes comments using this method, use setLikes for this
     */
    getLikes() {
        return [...this.attributes.likes];
    }

    setLikes(likes: LikeModel[]): boolean {
        if (likes.length > 10) return false;

        this.attributes.likes = likes.map((entity) => {
            if (typeof entity.id != "string" && typeof entity.id != undefined) {
                throw Error("id must be string!!!");
            }

            entity.id = new ObjectId().toHexString();

            return {
                ...entity.attributes,
                _id: ObjectId.createFromHexString(entity.id),
            };
        });

        return true;
    }

    /**
     * # IMPORTANT
     *
     * you cant modify comments using this method, use setComments for this
     */
    getComments() {
        return [...this.attributes.comments];
    }

    setComments(comments: CommentModel[]): boolean {
        if (comments.length > 10) return false;

        this.attributes.comments = comments.map((entity) => {
            if (typeof entity.id != "string" && typeof entity.id != undefined) {
                throw Error("id must be string!!!");
            }

            entity.id = new ObjectId().toHexString();

            return {
                ...entity.attributes,
                _id: ObjectId.createFromHexString(entity.id),
            };
        });

        return true;
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
    pushNewComment(comment: CommentModel): CommentModel | void {
        if (this.attributes.comments.length >= this.COMMENT_MAX_ITEMS) {
            const oldest = this.attributes.comments.shift();

            if (!oldest) {
                throw new Error("Must have oldest");
            }

            this.attributes.comments.push({
                _id: new ObjectId(comment.id),
                ...comment.attributes,
            });

            return new CommentModel(
                comment.getStorage(),
                oldest,
                oldest._id.toHexString()
            );
        }
        this.attributes.comments.push({
            ...comment.attributes,
            _id: new ObjectId(),
        });
    }

    /**
     *
     * @param like
     * @returns the oldest like if has too many likes
     *
     *
     * push a new like, return the oldest if there is more than too many likes.
     *
     * will automatically increment the number of likes
     */
    pushNewLike(like: LikeModel): LikeModel | void {
        if (this.attributes.likes.length >= this.LIKES_MAX_ITEMS) {
            const oldest = this.attributes.likes.shift();

            if (typeof like.id != "string") {
                throw new Error("like must have id");
            }
            if (!oldest) {
                throw new Error("must have oldest");
            }

            this.attributes.likes.push({
                ...like.attributes,
                _id: ObjectId.createFromHexString(like.id),
            });

            return new LikeModel(
                like.getStorage(),
                oldest,
                oldest._id.toHexString()
            );
        }
    }

    removeCommentById(commentId: ObjectId): boolean {
        for (let i = 0; i < this.attributes.comments.length; i++)
            if (
                this.attributes.comments[i]._id.toHexString() ==
                commentId.toHexString()
            ) {
                this.attributes.comments.splice(i, 1);
                return true;
            }

        return false;
    }

    removeLikeById(likeId: ObjectId): boolean {
        for (let i = 0; i < this.attributes.likes.length; i++)
            if (
                this.attributes.likes[i]._id.toHexString() ==
                likeId.toHexString()
            ) {
                this.attributes.likes.splice(i, 1);
                return true;
            }

        return false;
    }

    public canUserDelete(user: UserModel): boolean {
        return this.attributes.usr.id.toString() == user.id?.toString();
    }

    public toJSON(): object {
        return {
            title: this.getTitle(),
            text: this.getText(),
            user: {
                name: this.getUser().name,
            },
            comments: this.getComments().map((commentSchema) => {
                return {
                    text: commentSchema.text,
                    date: commentSchema.dt.toDateString(),
                    user: {
                        name: commentSchema.usr.name,
                    },
                };
            }),
            likes: this.getLikes().map((likeSchema) => {
                return {
                    date: likeSchema.dt.toDateString(),
                    user: {
                        name: likeSchema.usr.name,
                    },
                };
            }),
            date: this.getDate().getTime(),
            id: this.id,
        };
    }
}
