import { Router } from "express";
import { postsControllers } from "./post_controllers";

export const postRouter:Router=Router();

postRouter.get("/", postsControllers.getAllPostsController);
postRouter.get("/stats", postsControllers.getPostStatisticsController);
postRouter.get("/my-posts", postsControllers.getMyPostsController);
postRouter.get("/:postId", postsControllers.getSinglePostController);
postRouter.post("/", postsControllers.registerPostController);
postRouter.patch("/:postId", postsControllers.updatePostController);
postRouter.delete("/:postId", )