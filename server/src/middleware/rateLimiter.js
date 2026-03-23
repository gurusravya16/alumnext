import rateLimit from "express-rate-limit";
import config from "../config/env.js";

/**
 * Rate limiters — disabled in local environment.
 */

// General API: 100 requests per 15 minutes
export const generalLimiter = config.isLocal
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests, please try again later",
      },
    });

// Auth routes: 20 requests per 15 minutes
export const authLimiter = config.isLocal
  ? (_req, _res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many authentication attempts, please try again later",
      },
    });
