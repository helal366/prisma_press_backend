import { CommnetStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  TUpdatePostPayload,
} from "./post_interfaces";

const getAllPostsServices = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1)*limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const  parsedTags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(parsedTags) ? parsedTags : [];
  const andConditions : PostWhereInput[]= [];
  if(query.searchTerm){
    andConditions.push(
      {
        OR: [
          {
            title: {
              contains: query.searchTerm,
              mode: "insensitive"
            }
          },
          {
            content : {
              contains: query.searchTerm,
              mode: "insensitive"
            }
          }
        ]
      }
    )
  };
  if(query.title){
    andConditions.push({
      title: query.title
    })
  };
  if(query.content){
    andConditions.push({
      content: query.content
    });
  };
  if(query.authorId){
    andConditions.push({
      authorId: query.authorId
    })
  };
  if(query.isFeatured){
    andConditions.push({
      isFeatured : Boolean(query.isFeatured)
    })
  };
  if(query.tags){
    andConditions.push({
      tags : {
        hasSome: tagsArray
      }
    })
  };
  if(query.status){
    andConditions.push({
      status: query.status
    })
  };
  const posts = await prisma.post.findMany({
    // where:{
    //   AND: [
    // filtering
    // {
    //   title: "Ronaldo"
    // },
    // {
    //   content: "Ronaldo"
    // },
    // {
    //   tags:{
    //     "equals": ["typescript"]
    //   }
    // }

    // searching
    //   ]
    // },
    // where:{
    //       title: {
    //         contains: "Ronaldo",
    //         mode: "insensitive"
    //       },
    //       content:{
    //         contains: "Ronaldo",
    //         mode: "insensitive"
    //       }
    //     },

    // searching partial
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "Ronaldo",
    //         mode: "insensitive",
    //       },
    //       content: {
    //         contains: "Ronaldo",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    // combine searching(OR operator) and filtering(AND operator)
    // where: {
    //   AND: [
    //     {
    //       OR: [
    //         {
    //           title: {
    //             contains: "Ron",
    //             mode: "insensitive"
    //           },
    //           content: {
    //             contains: "Ron",
    //             mode: "insensitive"
    //           }
             
    //         }
    //       ]
    //     },
    //     {
    //       title: "Ronaldo Rozario"
    //     },
    //     {
    //       content: "Ronaldo"
    //     }
    //   ]
    // },

    // dynamic searching, filtering
    // where: {
    //   AND: [
    //       query.searchTerm ? {
    //         OR: [
    //           {
    //             title: {
    //               contains: query.searchTerm,
    //               mode: "insensitive"
    //             }
    //           },
    //           {
    //             content: {
    //               contains: query.searchTerm,
    //               mode: "insensitive"
    //             }
    //           }
    //         ]
    //       } : {},
    //       query.title ? { title : query.title } : {},
    //       query.content ? {content: query.content} : {}
    //   ]
    // },

    // dynamic searching, filtering
    where:{
      AND: andConditions
    },
    // dynamic pagination
    
    take: limit,
    skip: skip,

    // dynamic sorting
    orderBy:{
      [sortBy]: sortOrder
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};
const getPostStatisticsServices = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    //     const totalPosts = await tx.post.count();
    //     const totalPublishedPosts = await tx.post.count({
    //       where: {
    //         status: PostStatus.PUBLISHED,
    //       },
    //     });
    //     const totalDraftPosts = await tx.post.count({
    //       where: {
    //         status: PostStatus.DRAFT,
    //       },
    //     });
    //     const totalArchievedPosts = await tx.post.count({
    //       where: {
    //         status: PostStatus.ARCHIEVED,
    //       },
    //     });
    //     const totalComments = await tx.comment.count();
    //     const totalApprovedComments = await tx.comment.count({
    //       where: {
    //         status: CommnetStatus.APPROVED,
    //       },
    //     });
    //     const totalRejectedComments = await tx.comment.count({
    //       where: {
    //         status: CommnetStatus.REJECTED,
    //       },
    //     });
    //     const totalPendingComments = await tx.comment.count({
    //       where: {
    //         status: CommnetStatus.PENDING,
    //       },
    //     });
    //     // const allPosts = await tx.post.findMany();
    //     // allPosts.forEach(post=>{
    //     //     totalPostViews = totalPostViews + post.views;
    //     // })
    //     const totalPostViewsAggregate = await tx.post.aggregate({
    //       _sum: {
    //         views: true,
    //       },
    //     });
    //     const totalPostViews = totalPostViewsAggregate._sum.views;

    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchievedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPendingComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIEVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommnetStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommnetStatus.REJECTED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommnetStatus.PENDING,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    const totalPostViews = totalPostViewsAggregate._sum.views;
    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchievedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPendingComments,
      totalPostViews,
    };
  });
  return transactionResult;
};
const getMyPostsServices = async (userId: string) => {
  const myPosts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return myPosts;
};
const getPostByIdServices = async (postId: string) => {
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
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    //  throw new Error("Fake error");
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};
const createPostServices = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};
const updatePostServices = async (
  payload: TUpdatePostPayload,
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && authorId !== post.authorId) {
    throw new Error("You are neither Admin nor Owner of this post.");
  }
  if (payload.isFeatured !== undefined && !isAdmin) {
    throw new Error(`Only Admin can change the "isFeatured" field`);
  }
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        where: {
          status: CommnetStatus.APPROVED,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return updatedPost;
};
const deletePostServices = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && authorId !== post.authorId) {
    throw new Error("You are neither Admin nor Owner of this post.");
  }
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};
export const postsServices = {
  getAllPostsServices,
  getPostStatisticsServices,
  getMyPostsServices,
  getPostByIdServices,
  createPostServices,
  updatePostServices,
  deletePostServices,
};
