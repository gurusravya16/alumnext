import { body, param } from "express-validator";

export const createPostRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

export const deletePostRules = [
  param("id").isUUID().withMessage("Invalid post ID"),
];
