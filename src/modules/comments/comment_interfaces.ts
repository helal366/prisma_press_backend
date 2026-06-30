import { CommnetStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload{
    content: string,
    postId:string,
    status?: CommnetStatus
}
export interface IUpdateCommentPayload{
    content?: string,
    status?: CommnetStatus
}
export interface IModerateCommentPayload{
    status: CommnetStatus
}