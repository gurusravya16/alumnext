import { Router } from "express";
import authenticate from "../../middleware/auth.js";
import {
  getAdminStats,
  getPendingApprovals,
  approveUser,
  rejectUser,
  getAllUsers,
  deleteUser,
} from "./admin.controller.js";
import { createAnnouncement } from "../announcement/announcement.controller.js";

const router = Router();

// Admin-only middleware (auth + role check)
function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}

router.use(authenticate, requireAdmin);

router.get("/stats", getAdminStats);
router.get("/approvals", getPendingApprovals);
router.put("/approvals/:id/approve", approveUser);
router.delete("/approvals/:id/reject", rejectUser);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.post("/announcements", createAnnouncement);

export default router;
