import { config as loadDotenv } from "dotenv";
import { z } from "zod";

// Load environment variables from appropriate .env file based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${nodeEnv}`;

console.log(`🔧 Loading environment from: ${envFile}`);
loadDotenv({ path: envFile });

// Environment validation schema
const envSchema = z.object({
  // Server Configuration
  PORT: z.string().default("3001").transform(Number),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  MONGODB_URI: z.string().default("mongodb://localhost:27017/"),

  // Frontend URL (for CORS)
  FRONTEND_URL: z.string().default("http://localhost:8818"),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:");
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

// Export validated configuration
export const env = parseEnv();

// Type-safe configuration object
export const config = {
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === "development",
    isProduction: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
  },

  database: {
    uri: env.MONGODB_URI,
  },

  cors: {
    frontendUrl: env.FRONTEND_URL,
  },
} as const;

// Export individual config sections for convenience
export const {
  server: serverConfig,
  database: databaseConfig,
  cors: corsConfig,
} = config;

// Log configuration on startup (excluding sensitive data)
export const logConfig = () => {
  console.log("🔧 Server Configuration:");
  console.log(`  - Port: ${serverConfig.port}`);
  console.log(`  - Environment: ${serverConfig.nodeEnv}`);
  console.log(
    `  - Database: ${databaseConfig.uri.replace(/\/\/.*@/, "//***:***@")}`
  ); // Hide credentials
  console.log(`  - Frontend URL: ${corsConfig.frontendUrl}`);
};
