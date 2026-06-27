import { Router } from "express";
import { postsControllers } from "./post_controllers";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "../../../generated/prisma/enums";

export const postRouter:Router=Router();

postRouter.get("/", postsControllers.getAllPostsController);
postRouter.get("/stats", userAuth(Role.ADMIN), postsControllers.getPostStatisticsController);
postRouter.get("/my-posts", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), postsControllers.getMyPostsController);
postRouter.get("/:postId", postsControllers.getSinglePostController);
postRouter.post("/", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), postsControllers.createPostController);
postRouter.patch("/:postId", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), postsControllers.updatePostController);
postRouter.delete("/:postId", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), postsControllers.deletePostController);