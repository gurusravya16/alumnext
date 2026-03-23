/**
 * Custom operational error.
 * Errors created with this class are considered "expected" — the error
 * handler will forward statusCode and message to the client.
 */
export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
