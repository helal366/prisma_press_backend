import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth_services";
import { StatusCodes } from "http-status-codes";

const loginUserController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload=req.body;
    console.log("Payload received in loginUserController:", payload); // Debugging line
    const user=await authServices.loginUserServices(payload);
    res.status(StatusCodes.OK).json({
        status:"success",
        statusCode:StatusCodes.OK,
        message:"User logged in successfully",
        data:user
    })
})

export const authControllers = {
    loginUserController
}