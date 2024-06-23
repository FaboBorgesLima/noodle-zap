import express from "express";
import { UserController } from "../controller/user.controller";
import { connPoll } from "../connection/mysql";
import { UserStorage } from "../model/userStorage.model";

const apiRoutes = express.Router();

apiRoutes.use(express.json());

apiRoutes.post("/user/create", async (req, res) => {
    const conn = await connPoll.getConnection();
    const userStorage = new UserStorage(conn);
    const userController = new UserController(userStorage);

    userController.create(req, res);
});

export { apiRoutes };
