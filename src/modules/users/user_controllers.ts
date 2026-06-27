import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user_services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ResolveFnOutput } from "node:module";
const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userServices.registerUserServices(payload);
    sendResponse(res, {
      success: true,
      message: "User registered successfully",
      statusCode: StatusCodes.CREATED,
      data: user,
    });
  },
);
const getMyProfileController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      sendResponse(res, {
        success: false,
        message: "User not authenticated",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
      return;
    }
    const profile = await userServices.getMyProfileServices(req.user.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User profile fetched successfully",
      data: profile,
    });
  },
);
const updateMyProfileController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const userId = req.user?.id as string;
  const payload = req.body;
  const updatedProfile = await userServices.updateMyProfileServices(userId, payload);
  console.log(updatedProfile);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile updated successfully.",
    data: {updatedProfile}
  })
})
export const userControllers = {
  registerUserController,
  getMyProfileController,
  updateMyProfileController
};
