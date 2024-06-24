import express from "express";
import { UserController } from "../controller/user.controller";
import { connPoll } from "../connection/mysql";
import { UserStorage } from "../model/userStorage.model";

const apiRoutes = express.Router();

apiRoutes.use(express.json());
apiRoutes.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

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

apiRoutes.use("/user", userRoutes);

export { apiRoutes };
