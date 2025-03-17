import { NextFunction, Request, Response } from "express";
import { UserModel } from "../model/entities/user.model";
import { UserFactory } from "../model/factories/userFactory";
import { UserStorage } from "../model/storage/userStorage";
import { pool } from "../connection/mysql";
import { MongodbUserFactory } from "../model/factories/mongodbUserFactory";
import { mongoClient } from "../connection/mongo";
import { MongodbUserModel } from "../model/entities/mongodbUser.model";
import { MongodbUserStorage } from "../model/storage/mongodbUserStorage";
import { CommentFactory } from "../model/factories/commentFactory";
import { CommentStorage } from "../model/storage/commentStorage";
import { CommentModel } from "../model/entities/comment.model";
import { PostFactory } from "../model/factories/postFactory";
import { PostStorage } from "../model/storage/postStorage";
import { PostModel } from "../model/entities/post.model";
import { LikeFactory } from "../model/factories/likeFactory";
import { LikeStorage } from "../model/storage/likeStorage";
import { LikeModel } from "../model/entities/likeModel.model";

interface EntityFactories {
    userFactory: UserFactory;
    mongodbUserFactory: MongodbUserFactory;
    commentFactory: CommentFactory;
    postFactory: PostFactory;
    likeFactory: LikeFactory;
}

export class EntityFactoriesProvider {
    public static instance?: EntityFactoriesProvider;

    protected constructor(public factories: EntityFactories) {
        //
    }

    public static getInstance(): EntityFactoriesProvider {
        if (this.instance) return this.instance;

        return new EntityFactoriesProvider({
            userFactory: new UserFactory(new UserStorage(pool), UserModel),
            mongodbUserFactory: new MongodbUserFactory(
                new MongodbUserStorage(mongoClient),
                MongodbUserModel
            ),
            commentFactory: new CommentFactory(
                new CommentStorage(mongoClient),
                CommentModel
            ),
            postFactory: new PostFactory(
                new PostStorage(mongoClient),
                PostModel
            ),
            likeFactory: new LikeFactory(
                new LikeStorage(mongoClient),
                LikeModel
            ),
        });
    }

    public static async middleware(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        if (res.locals.entityFactoriesProvider) {
            next();
            return;
        }

        res.locals.entityFactoriesProvider = this.getInstance();

        next();
    }
}
