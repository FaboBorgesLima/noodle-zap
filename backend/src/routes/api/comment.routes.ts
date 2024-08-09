import { connPoll } from "../../connection/mysql";
import { CommentControler } from "../../controller/comment.controller";
import { Auth } from "../../middleware/auth.middleware";
import { UserStorage } from "../../model/storage/userStorage.model";
import express from "express";

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

export { commentRoutes };
