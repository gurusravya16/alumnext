import { Router } from "express";
import {
  createPostRules,
  updatePostRules,
  deletePostRules,
} from "./posts.validators.js";
import validate from "../../middleware/validate.js";
import authenticateJWT from "../../middleware/auth.js";
import * as postsController from "./posts.controller.js";

const router = Router();

// GET /api/posts — authenticated
router.get("/", authenticateJWT, postsController.listPosts);

// POST /api/posts/:id/like — authenticated
router.post("/:id/like", authenticateJWT, postsController.toggleLike);

// POST /api/posts — authenticated + validation
router.post(
  "/",
  authenticateJWT,
  createPostRules,
  validate,
  postsController.createPost
);

// PUT /api/posts/:id — authenticated + validation + ownership + 24h check
router.put(
  "/:id",
  authenticateJWT,
  updatePostRules,
  validate,
  postsController.updatePost
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
