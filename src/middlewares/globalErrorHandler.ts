import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../generated/prisma/client";
import { envVars } from "../config";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let errorMessage = error.message || "Internal Server Error";
  let errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let errorName = error.name || "Error";
  let errorDetails: any = null;
  if (error instanceof Prisma.PrismaClientValidationError) {
    errorStatusCode = StatusCodes.BAD_REQUEST;
    errorMessage = "Missing field or Incorrect field type.";
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    errorStatusCode = StatusCodes.BAD_REQUEST;
    switch (error.code) {
      case "P2002":
        errorMessage = `Duplicate field value violates unique constraint: ${error.meta?.target}`;
        break;

      case "P2003":
        errorMessage = `Invalid foreign key: ${error.meta?.field_name}`;
        break;

      case "P2025":
        errorMessage = "Requested resource not found.";
        errorStatusCode = StatusCodes.NOT_FOUND;
        break;

      default:
        errorMessage = "Database error occurred.";
    }

    errorDetails = error.meta;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    errorStatusCode = StatusCodes.SERVICE_UNAVAILABLE; // 503
    errorMessage = "Database connection failed. Please try again later.";
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    errorMessage = "An unexpected database error occurred.";
  }  else if (error instanceof SyntaxError) {
    errorStatusCode = StatusCodes.BAD_REQUEST;
    errorMessage = "Invalid JSON format in request.";
  }
  res.status(errorStatusCode).json({
    success: false,
    statusCode: errorStatusCode,
    name: errorName,
    message: errorMessage,
    details: errorDetails,
    stack: envVars.NODE_ENV === "development" ? error.stack : undefined,
  });
};
