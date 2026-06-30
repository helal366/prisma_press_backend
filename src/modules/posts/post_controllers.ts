import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postsServices } from "./post_services";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllPostsController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const query = req.query;
    const posts = await postsServices.getAllPostsServices(query);
    sendResponse(res, {
        success: true,
        statusCode:StatusCodes.OK,
        message: "All posts are retrieved successfully.",
        data: {posts}
    })
});
const getPostStatisticsController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await postsServices.getPostStatisticsServices();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "All statistics are here.",
        data: result
    })
});
const getMyPostsController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const authorId = req.user?.id;
    if(!authorId){
        throw new Error("Author not found.");
    }
    const myPosts = await postsServices.getMyPostsServices(authorId);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Author's posts retrieved successfully.",
        data: {myPosts}
    })
});
const getPostByIdController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {postId}=req.params;
    if(!postId){
        throw new Error("Post id required in params.");
    }
    const post = await postsServices.getPostByIdServices(postId as string);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Post retrieved successfully.",
        data: {post}
    })
});
const createPostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.user?.id;

    if(!id){
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: "User not found. Please login."
        })
        return;
    }
    const payload = req.body;
    const result = await postsServices.createPostServices(payload, id);
    sendResponse(res,{
        success: true,
        statusCode: StatusCodes.CREATED,
        message: "Post created successfully.",
        data: result
    })
});
const updatePostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const payload=req.body;
    const {postId}=req.params;
    const authorId=req.user?.id;
    const isAdmin=req.user?.role === "ADMIN";
    if(!postId){
        throw new Error("Post id is not provided in params")
    }
    if(!authorId){
        throw new Error("Author not found. Please login.")
    }
    const updatedPost = await postsServices.updatePostServices(payload, postId as string, authorId, isAdmin);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Post updated successfully.",
        data: {updatedPost}
    })
});
const deletePostController=catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const {postId}=req.params;
    const authorId=req.user?.id;
    const isAdmin=req.user?.role === "ADMIN";
    if(!postId){
        throw new Error("Post id is not provided in params")
    }
    if(!authorId){
        throw new Error("Author not found. Please login.")
    }
    await postsServices.deletePostServices(postId as string, authorId, isAdmin);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Post deleted successfully.",
    })
});
export const postsControllers={
    getAllPostsController,
    getPostStatisticsController,
    getMyPostsController,
    getPostByIdController,
    createPostController,
    updatePostController,
    deletePostController
}