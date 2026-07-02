import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { envVars } from "../../config";
import { TRegisterUserPayload, TUpdateUserPayload } from "./user_interfaces";

const registerUserServices = async (payload: TRegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });
  // if(isUserExist){
  //     throw new Error("User already exists with this email");
  // }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });
  // await prisma.profile.create({
  //     data:{
  //         userId: createdUser.id,
  //         profilePhoto
  //     }
  // });
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  return user;
};
const getMyProfileServices = async (userId: string) => {
  const userProfile = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  return userProfile;
};
const updateMyProfileServices = async (
  userId: string,
  payload: TUpdateUserPayload,
) => {
  const { name, email, role, profilePhoto, bio, password } = payload;
  if (password) {
    throw new Error(
      `Password change is not allow here. Please remove password option. To change password, go to "Change password" or "Forget Password"`,
    );
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      role,
      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return updatedUser;
};
export const userServices = {
  registerUserServices,
  getMyProfileServices,
  updateMyProfileServices,
};
