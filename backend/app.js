import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import assetRoutes from "./routes/assets.js";
import assignmentRoutes from "./routes/assignments.js";
import authRoutes from "./routes/auth.js";
import baseRoutes from "./routes/bases.js";
import dashboardRoutes from "./routes/dashboard.js";
import expenditureRoutes from "./routes/expenditures.js";
import purchaseRoutes from "./routes/purchases.js";
import transferRoutes from "./routes/transfers.js";
import logger from "./utils/logger.js";

connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);
app.use(express.json());

// public health check
// app.get("/ping", (_req, res) => res.send("pong"));

// protected routes
app.use("/api", dashboardRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/expenditures", expenditureRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bases", baseRoutes);
app.use("/api/assets", assetRoutes);

// global error handler
app.use((err, _req, res, _next) => {
  logger.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
