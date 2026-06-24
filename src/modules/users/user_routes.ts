import  { Router } from "express";
import { userControllers } from "./user_controllers";


export const userRouter:Router = Router();
userRouter.post("/register", userControllers.registerUserController);
   