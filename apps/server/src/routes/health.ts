import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus,
        version: process.env.npm_package_version || "1.0.0",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Health check failed",
      },
    });
  }
});

export default router;
