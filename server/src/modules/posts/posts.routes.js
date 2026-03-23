import { Router } from "express";
import {
  createPostRules,
  deletePostRules,
} from "./posts.validators.js";
import validate from "../../middleware/validate.js";
import authenticateJWT from "../../middleware/auth.js";
import * as postsController from "./posts.controller.js";

const router = Router();

// GET /api/posts — public
router.get("/", postsController.listPosts);

// POST /api/posts — authenticated + validation
router.post(
  "/",
  authenticateJWT,
  createPostRules,
  validate,
  postsController.createPost
);

// DELETE /api/posts/:id — authenticated + param validation + ownership
router.delete(
  "/:id",
  authenticateJWT,
  deletePostRules,
  validate,
  postsController.deletePost
);

export default router;
