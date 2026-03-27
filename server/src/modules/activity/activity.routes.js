import { Router } from "express";
import { getMyActivity } from "./activity.controller.js";
import authenticate from "../../middleware/auth.js";

const router = Router();

router.get("/me", authenticate, getMyActivity);

export default router;
