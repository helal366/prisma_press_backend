import { TUser } from "../modules/users/user_interfaces";

export const userCheck=(user:TUser)=>{
    if(!user){
        throw new Error("User not found")
    }
    if(user.activeStatus === "BLOCKED"){
        throw new Error("User is blocked")
    }
}