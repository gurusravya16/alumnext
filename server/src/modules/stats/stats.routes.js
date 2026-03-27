import { Router } from "express";
import { getDashboardStats } from "./stats.controller.js";
import authenticate from "../../middleware/auth.js";

const router = Router();

router.get("/dashboard", authenticate, getDashboardStats);

export default router;
