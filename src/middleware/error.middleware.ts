import { Request, Response, NextFunction } from "express";
import { LoggerService } from "../services/logger.service";

/**
 * =====================================================
 * GLOBAL ERROR HANDLER
 * =====================================================
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent multiple responses
  if (res.headersSent) {
    return next(err);
  }

  // =====================================================
  // DEFAULT VALUES
  // =====================================================
  const statusCode = err.statusCode || err.status || 500;

  const message =
    err.message || "Internal Server Error";

  // =====================================================
  // LOG ERROR (SERVER SIDE ONLY)
  // =====================================================
  LoggerService.error("Unhandled API Error", {
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // =====================================================
  // RESPONSE FORMAT (CLIENT SAFE)
  // =====================================================
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};