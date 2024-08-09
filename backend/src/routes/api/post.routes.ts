import { connPoll } from "../../connection/mysql";
import { PostController } from "../../controller/post.controller";
import { Auth } from "../../middleware/auth.middleware";
import { UserStorage } from "../../model/storage/userStorage.model";
import express from "express";

const postRoutes = express.Router();

postRoutes.use("/auth", async (req, res, next) => {
    const conn = await connPoll.getConnection();

    new Auth(new UserStorage(conn)).middleware(req, res, next);
    conn.release();
});

postRoutes.post("/auth/create", PostController.create.bind(PostController));

postRoutes.get("/auth/page", PostController.getPage.bind(PostController));
postRoutes.get("/by-id/:id", PostController.getById.bind(PostController));

export { postRoutes };
