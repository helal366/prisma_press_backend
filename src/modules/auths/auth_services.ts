import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth_interfaces";
import { envVars } from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtTokens } from "../../utils/jwtTokens";
import { userCheck } from "../../utils/userCheck";

const loginUserServices = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  userCheck(user);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  const jwtPayload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  //   const accessToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
  //     expiresIn: envVars.JWT_ACCESS_EXPIRES,
  //   } as SignOptions);
  const accessToken = jwtTokens.createToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES as SignOptions,
  );

  const refreshToken = jwtTokens.createToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES as SignOptions,
  );

  return { accessToken, refreshToken };
};

const refreshTokenServices=async(refreshToken:string)=>{
  const verifiedRefreshToken = jwtTokens.verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);
  if(!verifiedRefreshToken.success){
    throw new Error(verifiedRefreshToken.error);
  }
  const {id} = verifiedRefreshToken.data as JwtPayload;
  const user = await prisma.user.findUniqueOrThrow({
    where:{id},
    omit:{password:true,}
  });
  if(user.activeStatus==="BLOCKED"){
    throw new Error("This user is blocked")
  };
  const jwtPayload:JwtPayload={
    id,
    name:user.name,
    email:user.email,
    role: user.role
  };
  const accessToken = jwtTokens.createToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES as SignOptions
  )
  return {accessToken}
}
export const authServices = {
  loginUserServices,
  refreshTokenServices,
};
