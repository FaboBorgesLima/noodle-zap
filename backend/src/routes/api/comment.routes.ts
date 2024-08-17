import { CommentControler } from "../../controller/comment.controller";
import { Auth } from "../../middleware/auth.middleware";
import express from "express";

const commentRoutes = express.Router();

commentRoutes.use("/auth", Auth.middleware.bind(Auth));
commentRoutes.post(
    "/auth/create",
    CommentControler.create.bind(CommentControler)
);
commentRoutes.delete(
    "/auth/delete/:postId/:commentId",
    CommentControler.delete.bind(CommentControler)
);

export { commentRoutes };
