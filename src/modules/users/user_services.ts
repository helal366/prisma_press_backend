import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { envVars } from "../../config";
import { PayloadRegisterUser } from "./user_interfaces";


const registerUserServices = async(payload: PayloadRegisterUser) => {
    const {name, email, password, profilePhoto} =payload;
    const isUserExist = await prisma.user.findUnique({
        where:{
            email: email}});
    if(isUserExist){
        throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(password, Number(envVars.BCRYPT_SALT_ROUND));
    const createdUser =await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
            profile: {
                create:{
                    profilePhoto
                }
            }
        }
    });
    // await prisma.profile.create({
    //     data:{
    //         userId: createdUser.id,
    //         profilePhoto
    //     }
    // });
    const user = await prisma.user.findUnique({
        where:{
            id: createdUser.id,
            email: createdUser.email || email
        },
        include:{
            profile: true
        },
        omit:{
            password: true
        }
    });
    return user;
}
export const userServices = {
    registerUserServices
}