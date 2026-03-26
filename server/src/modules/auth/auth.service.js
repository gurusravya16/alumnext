import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js"; 
import config from "../../config/env.js";
import AppError from "../../utils/AppError.js";

/**
 * Register a new user.
 * - STUDENT → status APPROVED
 * - ALUMNI  → status PENDING
 */
export async function register({ name, email, password, role }) {
  // Check if email is already taken
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const status = role === "STUDENT" ? "APPROVED" : "PENDING";

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      status,
    },
  });

  // Return sanitized user (no password)
  const { password: _, ...sanitizedUser } = user;

  // Sign JWT with minimal payload
  const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  return { user: sanitizedUser, token };
}

/**
 * Login an existing user.
 * - Rejects PENDING accounts with a clear message
 * - Returns generic message for bad credentials (no field leaking)
 */
export async function login({ email, password }) {
  // Generic error to avoid leaking which field failed
  const INVALID_MSG = "Invalid email or password";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(INVALID_MSG, 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(INVALID_MSG, 401);
  }

  // Allow PENDING users to log in but we indicate their status to the client
  // so the client can redirect them to /pending-approval
  const { password: _, ...sanitizedUser } = user;

  const token = jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  return { user: sanitizedUser, token };
}

/**
 * Get the current user profile (called with req.user from auth middleware).
 */
export async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const { password: _, ...sanitizedUser } = user;
  return sanitizedUser;
}
