import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const commentRegisterController = catchAsync((req:Request, res:Response, next:NextFunction)=>{

});
const getCommentAuthorController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const getCommentController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const updateCommentController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const updateCommentModerateController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const deleteCommentController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
export const commentControllers={
    commentRegisterController,
    getCommentAuthorController,
    getCommentController,
    updateCommentController,
    updateCommentModerateController,
    deleteCommentController
}