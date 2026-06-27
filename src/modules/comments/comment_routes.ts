import { Router } from "express";
import { commentControllers } from "./comment_controllers";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "../../../generated/prisma/enums";

export const commentRouter:Router=Router();

commentRouter.get("/author/:authorId", commentControllers.getCommentAuthorController);
commentRouter.get("/:commentId", commentControllers.getCommentController);
commentRouter.post("/", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), commentControllers.commentRegisterController)
commentRouter.patch("/:commentId", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), commentControllers.updateCommentController);
commentRouter.patch("/:commentId/moderate", userAuth(Role.ADMIN), commentControllers.updateCommentModerateController);
commentRouter.delete("/:commentId", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), commentControllers.deleteCommentController)