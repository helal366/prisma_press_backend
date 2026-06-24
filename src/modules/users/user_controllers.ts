import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user_services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
const registerUserController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userServices.registerUserServices(payload);
    sendResponse(res, {
      success: true,
      message: "User registered successfully",
      statusCode: StatusCodes.CREATED,
      data: user
    });
    // res.status(StatusCodes.CREATED).json({
    //     success: true,
    //   message: "User registered successfully",
    //   statusCode: StatusCodes.CREATED,
    //   data: user,
    // });  
});

export const userControllers = {
  registerUserController,
};
