import { PostController } from "../../controller/post.controller";
import { Auth } from "../../middleware/auth.middleware";
import express from "express";

const postRoutes = express.Router();

postRoutes.use("/auth", Auth.middleware.bind(Auth));

postRoutes.post("/auth/create", PostController.create.bind(PostController));

postRoutes.get("/auth/page", PostController.getPage.bind(PostController));
postRoutes.get("/by-id/:id", PostController.getById.bind(PostController));
postRoutes.delete(
    "/auth/delete/:id",
    PostController.deletePost.bind(PostController)
);

export { postRoutes };
