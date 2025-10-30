import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { connectDatabase } from "./config/database";
import { serverConfig, corsConfig, logConfig } from "./config/config";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import polymarketRoutes from "./routes/polymarket";
import healthRoutes from "./routes/health";
import truthSocialRoutes from "./routes/truthsocial";

const app: express.Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: [corsConfig.frontendUrl, "https://truthsocial.com"],
    credentials: true,
  })
);

// Compression and logging
app.use(compression());
app.use(morgan("common"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/polymarket", polymarketRoutes);
app.use("/api/truthsocial", truthSocialRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    app.listen(serverConfig.port, () => {
      console.log(`🚀 Server running on port ${serverConfig.port}`);
      logConfig();
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
