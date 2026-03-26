import * as postsService from "./posts.service.js";
import AppError from "../../utils/AppError.js";

export async function createPost(req, res, next) {
  try {
    // Only alumni are allowed to create posts.
    if (String(req.user?.role) !== "ALUMNI") {
      throw new AppError("Only alumni can create posts", 403);
    }

    const post = await postsService.createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.id,
    });
    res.status(201).json({ success: true, data: { post } });
  } catch (err) {
    next(err);
  }
}

export async function listPosts(_req, res, next) {
  try {
    const posts = await postsService.listPosts();
    res.status(200).json({ success: true, data: { posts } });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const result = await postsService.deletePost(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
