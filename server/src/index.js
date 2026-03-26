import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import config from "./config/env.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import postsRoutes from "./modules/posts/posts.routes.js";
import alumniRoutes from "./modules/alumni/alumni.routes.js";

const app = express();

// ── Security ──────────────────────────────────────
// Helmet: enabled in development and production, skipped in local
if (!config.isLocal) {
  app.use(helmet());
}

// ── CORS ──────────────────────────────────────────
app.use(
  cors({
    origin: config.isLocal ? true : config.CLIENT_URL,
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────
app.use(express.json());

// ── Logging ───────────────────────────────────────
if (config.isLocal) {
  app.use(morgan("dev"));
} else if (config.isDev) {
  app.use(morgan("combined"));
} else {
  // Production — minimal logging
  app.use(morgan("combined"));
}

// ── Rate limiting ────────────────────────────────
app.use(generalLimiter);

// ── Health check ─────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AlumNext API is running",
  });
});

// ── Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/alumni", alumniRoutes);

// ── 404 catch-all ────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ── Centralized error handling (MUST be last) ────
app.use(errorHandler);

// ── Start server ─────────────────────────────────
app.listen(config.PORT, () => {
  console.log(
    `🚀 AlumNext API running on http://localhost:${config.PORT} [${config.NODE_ENV}]`
  );
});

export default app;
