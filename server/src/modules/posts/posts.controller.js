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

export async function listPosts(req, res, next) {
  try {
    const posts = await postsService.listPosts(req.user?.id);
    res.status(200).json({ success: true, data: { posts } });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await postsService.updatePost(req.params.id, req.user.id, {
      title: req.body.title,
      content: req.body.content,
    });
    res.status(200).json({ success: true, data: { post } });
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

export async function toggleLike(req, res, next) {
  try {
    const result = await postsService.toggleLike(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
