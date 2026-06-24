import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth_services";
import { StatusCodes } from "http-status-codes";

const loginUserController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload=req.body;
    const loginData=await authServices.loginUserServices(payload);
    res.status(StatusCodes.OK).json({
        status:"success",
        statusCode:StatusCodes.OK,
        message:"User logged in successfully",
        data:loginData
    })
})

export const authControllers = {
    loginUserController
}