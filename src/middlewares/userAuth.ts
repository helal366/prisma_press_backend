import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtTokens } from "../utils/jwtTokens";
import { envVars } from "../config";
import { Role } from "../../generated/prisma/client";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/sendResponse";
import { prisma } from "../lib/prisma";
import { userCheck } from "../utils/userCheck";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const userAuth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken? req.cookies.accessToken: (req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization);
    const verifiedAccessToken = jwtTokens.verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET,
    );
    // console.log("verifiedToken: ", verifiedAccessToken);
    if (!verifiedAccessToken.success) {
      sendResponse(res, {
        success: false,
        message: verifiedAccessToken.error,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
      return;
    }
    if (!verifiedAccessToken.data || typeof verifiedAccessToken.data === "string") {
      sendResponse(res, {   
        success: false,
        message: "Invalid token payload",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
      return;
    }
    const userRole = verifiedAccessToken.data.role;
    // console.log("userRole: ", userRole);

    if (!requiredRoles.length) {
      sendResponse(res, {
        success: false,
        message: "The Role is not defined.",
        statusCode: StatusCodes.FORBIDDEN,
      });
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      sendResponse(res, {
        success: false,
        message: "You do not have permission to access this resource",
        statusCode: StatusCodes.FORBIDDEN,
      });
      return;
    }
    const { id, name, email, role } = verifiedAccessToken.data;
    const user= await prisma.user.findUniqueOrThrow({
      where: { id }, 
      omit: {
        
      }
    });
    // console.log("user", user)
    userCheck(user);
    req.user = { id, name, email, role };

    next();
  }
)}
