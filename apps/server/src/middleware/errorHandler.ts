import { Request, Response, NextFunction } from "express";
import { serverConfig } from "../config/config";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;

  // Log detailed error information for debugging
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Prepare error response
  const errorResponse: any = {
    success: false,
    error: {
      message: serverConfig.isDevelopment
        ? error.message
        : statusCode === 500
          ? "Internal Server Error"
          : error.message,
      status: statusCode,
    },
  };

  // Only include stack trace in development
  if (serverConfig.isDevelopment) {
    errorResponse.error.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};
