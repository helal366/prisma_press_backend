import { ActiveStatus, Role } from "../../../generated/prisma/enums"

export type TRegisterUserPayload={
    name:string,
    email:string,
    password:string,
    profilePhoto?:string
}
export type TUser = {
    id:string,
    name: string,
    email: string,
    password?:string,
    profilePhoto?:string,
    bio?:string,
    activeStatus: ActiveStatus,
    role: Role
}
export type TUpdateUserPayload={
    name?: string,
    email?:string,
    profilePhoto?:string,
    activeStatus?:ActiveStatus,
    role?:Role,
    bio?:string,
    password?:string
}