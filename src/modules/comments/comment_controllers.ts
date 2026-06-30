import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { commentServices } from "./comment_services";

const createCommentController = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
   const authorId = req.user?.id;
   if(!authorId){
    throw new Error("Commenter not found. Please login.")
   }
   const payload = req.body;
   const comment = await commentServices.createCommentServices(authorId, payload);
   sendResponse(res,{
    success:true,
    statusCode:StatusCodes.CREATED,
    message: "Comment created successfully.",
    data: {comment}
   })
});
const getCommentsByAuthorIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
     const {authorId} = req.params;
     if(!authorId){
        throw new Error("Author id not found.")
     }
     const comments = await commentServices.getCommentsByAuthorIdServices(authorId as string);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Comments retrieved successfully.",
        data: {comments}
    })
});
const getCommentByCommentIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {commentId} = req.params;
    if(!commentId){
        throw new Error("Comment id not provided")
    };
    const comment = await commentServices.getCommentByCommentIdServices(commentId as string);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Comment retrieved successfully.",
        data: {comment}
    })
});
const updateCommentController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {commentId}=req.params;
    if(!commentId){
        throw new Error("Comment id is not provided.");
    }

    const authorId = req.user?.id;
    if(!authorId){
        throw new Error("User not found. Please login.")
    }
    const payload = req.body;
    if(!payload){
        throw new Error("Please provide updated data.");
    }
    console.log({commentId, authorId, payload})
    const updatedComment = await commentServices.updateCommentServices(payload, commentId as string, authorId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Comment updated successfully.",
        data: {updatedComment}
    })

});
const moderateCommentController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {commentId}=req.params;
    if(!commentId){
        throw new Error("Comment id not provided in params");
    }
    const payload=req.body;
    if(!payload){
        throw new Error("No data provided. Please provide new status.");
    }
    const moderatedComment = await commentServices.moderateCommentServices(commentId as string, payload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Status moderated successfully.",
        data: moderatedComment
    })
});
const deleteCommentController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {commentId}=req.params;
    if(!commentId){
        throw new Error("Comment id not provided in params");
    }
    const authorId = req.user?.id;
    if(!authorId){
        throw new Error("Author id not found. Please login.")
    }
    const deletedComment= await commentServices.deleteCommentServices(commentId as string, authorId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Comment deleted successfully.",
        data: {deletedComment}
    })
});
export const commentControllers={
    createCommentController,
    getCommentsByAuthorIdController,
    getCommentByCommentIdController,
    updateCommentController,
    moderateCommentController,
    deleteCommentController
}