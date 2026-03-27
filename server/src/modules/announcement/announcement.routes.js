import { Router } from "express";
import { listAnnouncements } from "./announcement.controller.js";

const router = Router();

// GET /api/announcements — public (all authenticated users can view)
router.get("/", listAnnouncements);

export default router;
