import { connPoll } from "../../connection/mysql";
import { UserController } from "../../controller/user.controller";
import { Auth } from "../../middleware/auth.middleware";
import { UserStorage } from "../../model/storage/userStorage.model";
import express from "express";

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
export { userRoutes };
