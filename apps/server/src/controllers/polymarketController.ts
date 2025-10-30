import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { z } from "zod";
import type { ApiResponse } from "@polypulse/shared";

// Validation schemas
const searchQuerySchema = z.object({
  query: z.string().min(1).max(100),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0)),
  sortBy: z
    .enum(["volume", "created_at", "closes_at"])
    .optional()
    .default("volume"),
});

const marketIdSchema = z.object({
  marketId: z.string().min(1),
});

// Polymarket API base URL
const POLYMARKET_API_BASE = "https://gamma-api.polymarket.com";

export const searchMarkets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query, limit, offset, sortBy } = searchQuerySchema.parse(req.query);

    const response = await axios.get(`${POLYMARKET_API_BASE}/search`, {
      params: {
        query,
        limit,
        offset,
        sort_by: sortBy,
      },
      timeout: 10000,
    });

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid query parameters",
          details: error.errors,
        },
      });
    }

    console.error("Polymarket search error:", error);
    return next(error);
  }
};

export const getMarketDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { marketId } = marketIdSchema.parse(req.params);

    const response = await axios.get(
      `${POLYMARKET_API_BASE}/markets/${marketId}`,
      {
        timeout: 10000,
      }
    );

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid market ID",
          details: error.errors,
        },
      });
    }

    console.error("Polymarket market details error:", error);
    return next(error);
  }
};

export const getMarketHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { marketId } = marketIdSchema.parse(req.params);
    const { days = "30" } = req.query;

    const response = await axios.get(
      `${POLYMARKET_API_BASE}/markets/${marketId}/history`,
      {
        params: {
          days: parseInt(days as string, 10),
        },
        timeout: 10000,
      }
    );

    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid market ID",
          details: error.errors,
        },
      });
    }

    console.error("Polymarket market history error:", error);
    return next(error);
  }
};
