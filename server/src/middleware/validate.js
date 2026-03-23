import { validationResult } from "express-validator";

/**
 * Middleware that runs after express-validator check chains.
 * If there are validation errors, returns a standardized response
 * and does NOT call next().
 */
export default function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
}
