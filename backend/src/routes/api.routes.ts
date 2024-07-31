import express, { Response } from "express";
import { UserController } from "../controller/user.controller";
import { connPoll } from "../connection/mysql";
import { UserStorage } from "../model/userStorage.model";
import { Auth } from "../middleware/auth.middleware";
import { ItemInDb } from "../model/itemInDb.model";
import { UserModel } from "../model/user.model";
import { PostController } from "../controller/post.controller";
import { PostStorage } from "../model/postStorage.model";
import { mongoClient } from "../connection/mongo";

const apiRoutes = express.Router();

apiRoutes.use(express.json());
// ----------------------------------------- user routes

const userRoutes = express.Router();

userRoutes.post("/create", async (req, res) => {
    const conn = await connPoll.getConnection();
    const userStorage = new UserStorage(conn);
    const userController = new UserController(userStorage);

    await userController.create(req, res);
    conn.release();
});

userRoutes.post("/login", async (req, res) => {
    const conn = await connPoll.getConnection();
    const userStorage = new UserStorage(conn);
    const userController = new UserController(userStorage);

    await userController.login(req, res);
    conn.release();
});

userRoutes.post("/login-token", async (req, res) => {
    const conn = await connPoll.getConnection();
    const userStorage = new UserStorage(conn);
    const userController = new UserController(userStorage);

    await userController.loginViaToken(req, res);
    conn.release();
});

userRoutes.use("/auth", async (req, res, next) => {
    const conn = await connPoll.getConnection();

    new Auth(new UserStorage(conn)).middleware(req, res, next);
    conn.release();
});

userRoutes.delete("/auth/logout", async (req, res) => {
    const conn = await connPoll.getConnection();
    const userStorage = new UserStorage(conn);
    const userController = new UserController(userStorage);

    await userController.logout(
        req,
        <Response<any, { user: ItemInDb<UserModel, number> }>>res
    );
    conn.release();
});

userRoutes.get("/find-by-name/:name", async (req, res) => {
    const conn = await connPoll.getConnection();
    const userStorage = new UserStorage(conn);
    const userController = new UserController(userStorage);

    await userController.findByName(req, res);
    conn.release();
});

apiRoutes.use("/user", userRoutes);

// ----------------------------------------- post routes

const postRoutes = express.Router();

postRoutes.use("/auth", async (req, res, next) => {
    const conn = await connPoll.getConnection();

    new Auth(new UserStorage(conn)).middleware(req, res, next);
    conn.release();
});

postRoutes.post("/auth/create", async (req, res, next) => {
    const postController = new PostController(new PostStorage(mongoClient));

    postController.create(
        req,
        <Response<any, { user: ItemInDb<UserModel> }>>res
    );
});

postRoutes.get("/auth/page", async (req, res, next) => {
    const postController = new PostController(new PostStorage(mongoClient));

    postController.getPage(
        req,
        <Response<any, { user: ItemInDb<UserModel> }>>res
    );
});

apiRoutes.use("/post", postRoutes);

export { apiRoutes };
