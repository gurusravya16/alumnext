import config from "../config/env.js";

/**
 * Centralized error-handling middleware.
 * - Always returns { success: false, message }
 * - Includes stack trace ONLY in local environment
 * - Operational errors (AppError) preserve their statusCode
 * - Unknown errors default to 500
 */
export default function errorHandler(err, _req, res, _next) {
  const statusCode = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : "Internal server error";

  const response = {
    success: false,
    message,
  };

  // Show stack trace only in local environment
  if (config.isLocal) {
    response.stack = err.stack;
  }

  // Log the error for server-side debugging
  if (!config.isProd) {
    console.error("Error:", err);
  }

  res.status(statusCode).json(response);
}
