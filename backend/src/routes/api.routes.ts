import express from "express";
import { UserController } from "../controller/user.controller";
import { connPoll } from "../connection/mysql";
import { UserStorage } from "../model/storage/userStorage.model";
import { Auth } from "../middleware/auth.middleware";
import { PostController } from "../controller/post.controller";
import { CommentControler } from "../controller/comment.controller";

const apiRoutes = express.Router();

apiRoutes.use(express.json());
// ----------------------------------------- user routes

const userRoutes = express.Router();

userRoutes.post("/create", UserController.create.bind(UserController));

userRoutes.post("/login", UserController.login.bind(UserController));

userRoutes.post(
    "/login-token",
    UserController.loginViaToken.bind(UserController)
);

userRoutes.use("/auth", async (req, res, next) => {
    const conn = await connPoll.getConnection();

    new Auth(new UserStorage(conn)).middleware(req, res, next);
    conn.release();
});

userRoutes.delete("/auth/logout", UserController.logout);

userRoutes.get(
    "/find-by-name/:name",
    UserController.findByName.bind(UserController)
);

apiRoutes.use("/user", userRoutes);

// ----------------------------------------- post routes

const postRoutes = express.Router();

postRoutes.use("/auth", async (req, res, next) => {
    const conn = await connPoll.getConnection();

    new Auth(new UserStorage(conn)).middleware(req, res, next);
    conn.release();
});

postRoutes.post("/auth/create", PostController.create.bind(PostController));

postRoutes.get("/auth/page", PostController.getPage.bind(PostController));

apiRoutes.use("/post", postRoutes);

// ----------------------------------------- comment routes

const commentRoutes = express.Router();

commentRoutes.use("/auth", async (req, res, next) => {
    const conn = await connPoll.getConnection();

    new Auth(new UserStorage(conn)).middleware(req, res, next);
    conn.release();
});
commentRoutes.post(
    "/auth/create",
    CommentControler.create.bind(CommentControler)
);

apiRoutes.use("/comment", commentRoutes);

export { apiRoutes };
