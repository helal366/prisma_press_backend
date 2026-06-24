import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config";

const createToken=(jwtPayload:JwtPayload, jwtSecret:string, jwtExpiresIn:SignOptions)=>{
    const accessOrRefreshToekn=jwt.sign(jwtPayload, jwtSecret, {
        expiresIn: jwtExpiresIn
    } as SignOptions)
    
    return accessOrRefreshToekn
}

export const jwtTokens = {
    createToken
}


