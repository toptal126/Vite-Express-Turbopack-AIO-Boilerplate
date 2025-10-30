import express, { Express } from "express";
import healthRoutes from "./routes/health";

const app: Express = express();

app.use("/api/health", healthRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4443;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
