import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getAllPostsController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const getPostStatisticsController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const getMyPostsController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const getSinglePostController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const registerPostController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const updatePostController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
const deletePostController=catchAsync((req:Request, res:Response, next:NextFunction)=>{
    
});
export const postsControllers={
    getAllPostsController,
    getPostStatisticsController,
    getMyPostsController,
    getSinglePostController,
    registerPostController,
    updatePostController,
    deletePostController
}