import { Router } from "express";
import { commentControllers } from "./comment_controllers";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "../../../generated/prisma/enums";

export const commentRouter:Router=Router();

commentRouter.get("/author/:authorId", commentControllers.getCommentsByAuthorIdController);
commentRouter.get("/:commentId", commentControllers.getCommentByCommentIdController);
commentRouter.post("/", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), commentControllers.createCommentController)
commentRouter.patch("/:commentId", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), commentControllers.updateCommentController);
commentRouter.patch("/:commentId/moderate", userAuth(Role.ADMIN), commentControllers.moderateCommentController);
commentRouter.delete("/:commentId", userAuth(Role.ADMIN, Role.AUTHOR, Role.USER), commentControllers.deleteCommentController);