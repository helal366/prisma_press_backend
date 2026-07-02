import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { StatusCodes } from "http-status-codes"
import { subscriptionServices } from "./subscription_services"

const createCheckoutSessionController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const userId=req.user?.id;
    if(!userId){
        throw new Error("Please login.");
    }
    const result = await subscriptionServices.createCheckoutSessionServices(userId)
    sendResponse(res,{
        success: true,
        statusCode: StatusCodes.OK,
        message: "Payment url retrived successfully.",
        data: result
    })
})
export const subscriptionControllers={
    createCheckoutSessionController
}