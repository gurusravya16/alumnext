import jwt from "jsonwebtoken";
import config from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import AppError from "../utils/AppError.js";

/**
 * JWT authentication middleware.
 * 1. Extracts Bearer token from Authorization header
 * 2. Verifies token signature
 * 3. Fetches fresh user from DB (ensures user still exists)
 * 4. Attaches sanitized user object (no password) to req.user
 */
export default async function authenticateJWT(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Fetch fresh user — reject if user no longer exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    // Attach sanitized user (exclude password)
    const { password: _, ...sanitizedUser } = user;
    req.user = sanitizedUser;

    next();
  } catch (err) {
    if (err.isOperational) return next(err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new AppError("Invalid or expired token", 401));
    }
    next(err);
  }
}
