import { Router } from "express";
import { getUserProfile, updateUserProfile } from "./user.controller.js";
import authenticate from "../../middleware/auth.js";

const router = Router();

// Retrieve someone's profile (can be public or authenticated, we'll enforce authentication just in case)
router.get("/:id", authenticate, getUserProfile);

// Update own profile
router.put("/profile", authenticate, updateUserProfile);

export default router;
