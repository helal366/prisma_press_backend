import  { Router } from "express";
import { userControllers } from "./user_controllers";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "../../../generated/prisma/client";


export const userRouter:Router = Router();
userRouter.get("/me",userAuth(Role.USER, Role.AUTHOR, Role.ADMIN), userControllers.getMyProfileController);
userRouter.post("/register", userControllers.registerUserController);
userRouter.put("/my-profile", userAuth(Role.USER, Role.AUTHOR, Role.ADMIN), userControllers.updateMyProfileController)
   