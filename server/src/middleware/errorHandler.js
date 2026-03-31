import config from "../config/env.js";

/**
 * Centralized error-handling middleware.
 * - Always returns { success: false, message }
 * - Includes stack trace ONLY in local environment
 * - Operational errors (AppError) preserve their statusCode
 * - Unknown errors default to 500
 * - ALWAYS logs errors (including production) for debugging
 */
export default function errorHandler(err, _req, res, _next) {
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : "Internal server error";

  // Always log errors — essential for Render debugging
  console.error(`[Error] ${statusCode} — ${err.message}`);
  if (!config.isProd) {
    console.error(err.stack);
  }

  const response = {
    success: false,
    message,
  };

  // Show stack trace only in local environment
  if (config.isLocal) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
