import express from "express";
import { userRoutes } from "./api/user.routes";
import { postRoutes } from "./api/post.routes";
import { commentRoutes } from "./api/comment.routes";

const apiRoutes = express.Router();

apiRoutes.use(express.json());

// ----------------------------------------- user routes

apiRoutes.use("/user", userRoutes);

// ----------------------------------------- post routes

apiRoutes.use("/post", postRoutes);

// ----------------------------------------- comment routes

apiRoutes.use("/comment", commentRoutes);

export { apiRoutes };
