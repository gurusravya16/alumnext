import { Router } from "express";
import { createAd, getAds } from "./ads.controller.js";
import authenticate from "../../middleware/auth.js";

const router = Router();

// Only admin can post ads as requested
router.post("/", authenticate, createAd);
// All authenticated users can see ads
router.get("/", authenticate, getAds);

export default router;
