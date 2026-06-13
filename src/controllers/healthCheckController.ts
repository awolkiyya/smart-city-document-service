import { Request, Response, NextFunction } from "express";

/**
 * =====================================================
 * HEALTH CHECK
 * =====================================================
 */
export const healthCheckController = async (
    req: Request,
    res: Response
  ) => {
    return res.status(200).json({
      success: true,
      message: "Document service is running",
    });
  };
  