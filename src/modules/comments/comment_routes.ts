import { Router } from "express";
import { commentControllers } from "./comment_controllers";

export const commentRouter:Router=Router();

commentRouter.get("/author/:authorId", commentControllers.getCommentAuthorController);
commentRouter.get("/:commentId", commentControllers.getCommentController);
commentRouter.post("/", commentControllers.commentRegisterController)
commentRouter.patch("/:commentId", commentControllers.updateCommentController);
commentRouter.patch("/:commentId/moderate", commentControllers.updateCommentModerateController);
commentRouter.delete("/:commentId", )