import { Router } from "express";
import authenticateJWT from "../../middleware/auth.js";
import * as mentorshipController from "./mentorship.controller.js";

const router = Router();

// POST /api/mentorship — student creates a request
router.post("/", authenticateJWT, mentorshipController.createRequest);

// GET /api/mentorship/alumni — alumni views their requests
router.get("/alumni", authenticateJWT, mentorshipController.getAlumniRequests);

// GET /api/mentorship/student — student views their requests
router.get("/student", authenticateJWT, mentorshipController.getStudentRequests);

// PATCH /api/mentorship/:id — alumni approves/rejects
router.patch("/:id", authenticateJWT, mentorshipController.updateStatus);

export default router;
