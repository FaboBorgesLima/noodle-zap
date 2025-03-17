import { CommentRouteController } from "../../controller/comment.controller";
import { Auth } from "../../middleware/auth.middleware";
import express from "express";

const commentRoutes = express.Router();

commentRoutes.use("/auth", Auth.middleware.bind(Auth));
commentRoutes.post(
    "/auth/create",
    CommentRouteController.create.bind(CommentRouteController)
);
commentRoutes.delete(
    "/auth/delete/:postId/:commentId",
    CommentRouteController.delete.bind(CommentRouteController)
);

export { commentRoutes };
