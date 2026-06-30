import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags: string[]
}
export type TUpdatePostPayload = Partial<ICreatePostPayload>

export interface IPostQuery extends PostWhereInput{
  limit?:string;
  skip?:string;
  page?:string,
  sortOrder?:string;
  sortBy?:string;
  searchTerm?:string
}
