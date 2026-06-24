import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth_interfaces"

const loginUserServices = async(payload: ILoginUser) =>{
    const {email, password} = payload;
    const user =await prisma.user.findUniqueOrThrow({
        where:{
            email
        }
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new Error("Incorrect password");
    }
    return user;
}

export const authServices = {
    loginUserServices
}