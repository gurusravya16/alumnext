import { Router } from "express";
import { registerRules, loginRules } from "./auth.validators.js";
import validate from "../../middleware/validate.js";
import authenticateJWT from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import * as authController from "./auth.controller.js";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  authLimiter,
  registerRules,
  validate,
  authController.register
);

// POST /api/auth/login
router.post(
  "/login",
  authLimiter,
  loginRules,
  validate,
  authController.login
);

// GET /api/auth/me — protected
router.get("/me", authenticateJWT, authController.getMe);

export default router;
