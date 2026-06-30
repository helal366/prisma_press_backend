import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayload } from "./comment_interfaces";

const createCommentServices=async(authorId:string, payload:ICreateCommentPayload)=>{
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    });
    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    });
    return comment;
};

const getCommentsByAuthorIdServices=async(authorId:string)=>{
    const comments = await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post:{
                select: {
                    id: true,
                    title: true
                }
            },
            author: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });
    return comments
};
const getCommentByCommentIdServices=async(commnetId:string)=>{
    const comment = await prisma.comment.findUniqueOrThrow({
        where:{
            id:commnetId
        },
        include: {
            post:{
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    });
    return comment
};
const updateCommentServices=async(data:IUpdateCommentPayload, commentId:string, authorId:string)=>{
    await prisma.comment.findUniqueOrThrow({
        where: {
            id:commentId,
            authorId
        }
    });
    const updatedCommnet = await prisma.comment.update({
        where: {
            id: commentId,
            authorId: authorId
        },
        data
    });
    return updatedCommnet;
};
const moderateCommentServices=async(commentId:string, data:IModerateCommentPayload)=>{
    const commentData=await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    });
    if(data.status === commentData.status){
        throw new Error(`Your provided status ${data.status} is already upto date.`)
    }
    const comment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data
    });
    return comment;
};
const deleteCommentServices=async(commentId:string, authorId:string)=>{
    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })
    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId,
            authorId
        }
    })
    return deletedComment
}
export const commentServices={
    createCommentServices,
    getCommentsByAuthorIdServices,
    getCommentByCommentIdServices,
    updateCommentServices,
    moderateCommentServices,
    deleteCommentServices
}