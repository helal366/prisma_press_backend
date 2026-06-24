import { Router } from "express";
import { authControllers } from "./auth_controllers";

export const authRouter:Router=Router();

authRouter.post("/login", authControllers.loginUserController);