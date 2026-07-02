import { Router } from "express";
import { subscriptionControllers } from "./subscription_controllers";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "../../../generated/prisma/enums";

export const subscriptionRouter: Router = Router();
subscriptionRouter.post(
  "/checkout",
  userAuth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subscriptionControllers.createCheckoutSessionController,
);
