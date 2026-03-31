import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import config from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { initCloudinary } from "./utils/cloudinary.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import postsRoutes from "./modules/posts/posts.routes.js";
import alumniRoutes from "./modules/alumni/alumni.routes.js";
import mentorshipRoutes from "./modules/mentorship/mentorship.routes.js";
import usersRoutes from "./modules/users/user.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import adsRoutes from "./modules/ads/ads.routes.js";
import activityRoutes from "./modules/activity/activity.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import announcementRoutes from "./modules/announcement/announcement.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

const app = express();

// ── Initialize Cloudinary ─────────────────────────
initCloudinary();

// ── Security ──────────────────────────────────────
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
} else {
  app.use(morgan("combined"));
}

// ── Rate limiting ────────────────────────────────
app.use(generalLimiter);

// ── Health check (DB-aware) ──────────────────────
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "AlumNext API is running",
      database: "connected",
    });
  } catch (err) {
    console.error("[Health] DB check failed:", err.message);
    res.status(503).json({
      success: false,
      message: "Service unavailable — database unreachable",
    });
  }
});

// ── Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

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
app.listen(config.PORT, async () => {
  console.log(
    `🚀 AlumNext API running on port ${config.PORT} [${config.NODE_ENV}]`
  );

  // Verify DB connection at startup
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
});

export default app;
