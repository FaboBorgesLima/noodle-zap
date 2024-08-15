import { UserController } from "../../controller/user.controller";
import { Auth } from "../../middleware/auth.middleware";
import express from "express";

const userRoutes = express.Router();

userRoutes.post("/create", UserController.create.bind(UserController));

userRoutes.post("/login", UserController.login.bind(UserController));

userRoutes.post(
    "/login-token",
    UserController.loginViaToken.bind(UserController)
);

userRoutes.use("/auth", Auth.middleware.bind(Auth));

userRoutes.delete("/auth/logout", UserController.logout);

userRoutes.get(
    "/find-by-name/:name",
    UserController.findByName.bind(UserController)
);
export { userRoutes };
