import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth_services";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

const loginUserController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload=req.body;
    const {accessToken, refreshToken}=await authServices.loginUserServices(payload);
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000*60*60*24*1 // 1 day
    })
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,   
        sameSite:"none",
        maxAge:1000*60*60*24*7 // 7 days
    })
    res.status(StatusCodes.OK).json({
        status:"success",
        statusCode:StatusCodes.OK,
        message:"User logged in successfully",
        data:{ accessToken, refreshToken }
    })
});

const refreshTokenController=catchAsync(async(req:Request, res:Response,next:NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    const {accessToken} = await authServices.refreshTokenServices(refreshToken);
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000*60*60*24*1 // 1 day
    })
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Token refreshed successfully.",
        data: {accessToken}
    })
})
export const authControllers = {
    loginUserController,
    refreshTokenController
}