import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { logger } from "./requestLogger.js";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  logger.error({
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    url: req.originalUrl,
  });

  // Handle AppError (custom application errors)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }

  // Handle Sequelize validation errors
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors.map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize unique constraint errors
  if (error.name === "SequelizeUniqueConstraintError") {
    const field = Object.keys(error.fields || {})[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Generic error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
}
