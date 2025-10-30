import { Request, Response, NextFunction } from "express";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `API endpoint not found: ${req.originalUrl}`,
      status: 404,
    },
  });
};
