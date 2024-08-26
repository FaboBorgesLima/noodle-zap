import { LikeController } from "../../controller/like.controller";
import { Auth } from "../../middleware/auth.middleware";
import express from "express";

const likeRoutes = express.Router();

likeRoutes.use("/auth", Auth.middleware.bind(Auth));

likeRoutes.post("/auth/create", LikeController.create.bind(LikeController));

export { likeRoutes };
