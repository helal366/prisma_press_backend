import { CommnetStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, TUpdatePostPayload } from "./post_interfaces";

const getAllPostsServices=async()=>{
    const posts= await prisma.post.findMany({
        include:{
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    });
    return posts;
};
const getPostStatisticsServices=async()=>{

};
const getMyPostsServices=async(userId:string)=>{
    const myPosts = await prisma.post.findMany({
        where: {
            authorId: userId
        },
        orderBy:{
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count:{
                select:{
                    comments: true
                }
            }
        },
    })
    return myPosts
};
const getPostByIdServices=async(postId:string)=>{
    // const postById = await prisma.post.findUniqueOrThrow({
    //     where:{
    //         id:postId
    //     },
        
    //     include: {
    //         comments: true,
    //         author: {
    //             omit: {
    //                 password: true
    //             }
    //         },
    //         _count:{
    //             select:{
    //                 comments: true
    //             }
    //         }
    //     },
    // });
    // const updatedPost = await prisma.post.update({
    //    where:{
    //      id:postId
    //    },
    //    data:{
    //     views:{
    //         increment:1
    //     }
    //    },
    //    include:{
    //     author:{
    //         omit:{
    //             password:true
    //         }
    //     },
    //     comments: true
    //    }
    // });
    // return updatedPost
    const transactionResult = await prisma.$transaction(
        async(tx)=>{
             await tx.post.update({
                where: {
                    id: postId
                },
                data:{
                    views: {
                        increment: 1
                    }
                }
             });
            //  throw new Error("Fake error");
             const post = await tx.post.findUniqueOrThrow({
                where:{
                    id:postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: true,
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                },
             });
             return post;
        }
    );
    return transactionResult;
};
const createPostServices=async(payload:ICreatePostPayload, userId:string)=>{
    const result = await prisma.post.create({
        data:{
            ...payload,
            authorId: userId
        }
    })
    return result;
};
const updatePostServices=async(payload: TUpdatePostPayload,  postId: string, authorId:string, isAdmin:boolean)=>{
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });
    if(!isAdmin && authorId!==post.authorId){
        throw new Error("You are neither Admin nor Owner of this post.")
    };
    if(payload.isFeatured !== undefined && !isAdmin){
        throw new Error(`Only Admin can change the "isFeatured" field`)
    };
    const updatedPost =await prisma.post.update({
        where: {
            id:postId
        },
        data: payload,
        include: {
            author : {
                omit : {
                    password: true
                }
            },
            comments: {
                where: {
                    status: CommnetStatus.APPROVED
                }
            },
            _count:{
                select:{
                    comments: true
                }
            }
        }
    })
    return updatedPost
};
const deletePostServices=async(postId: string, authorId:string, isAdmin:boolean)=>{
     const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });
    if(!isAdmin && authorId!==post.authorId){
        throw new Error("You are neither Admin nor Owner of this post.")
    };
    await prisma.post.delete({
        where: {
            id: postId
        }
    });
};
export const postsServices={
    getAllPostsServices,
    getPostStatisticsServices,
    getMyPostsServices,
    getPostByIdServices,
    createPostServices,
    updatePostServices,
    deletePostServices
}