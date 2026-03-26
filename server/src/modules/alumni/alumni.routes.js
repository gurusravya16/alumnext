import { Router } from "express";
import * as alumniController from "./alumni.controller.js";

// GET /api/alumni — public (students filter alumni directory)
// Note: JWT not required per spec, but we keep it simple and allow public access.
const router = Router();

router.get("/", alumniController.listAlumni);

export default router;

