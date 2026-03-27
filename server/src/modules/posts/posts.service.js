import { prisma } from "../../lib/prisma.js"; 
import AppError from "../../utils/AppError.js";

/**
 * Create a new post. authorId comes from the authenticated user.
 */
export async function createPost({ title, content, authorId }) {
  const post = await prisma.post.create({
    data: { title, content, authorId },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
  return post;
}

/**
 * List all posts, newest first, with author info.
 */
export async function listPosts(userId) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
      likes: true, // we fetch all likes to count them and check if current user liked
    },
  });

  return posts.map(post => {
    const rawLikes = post.likes || [];
    const hasLiked = userId ? rawLikes.some(l => l.userId === userId) : false;
    const likeCount = rawLikes.length;
    // remove raw likes array so it isn't sent to frontend unnecessarily
    const { likes, ...rest } = post;
    return {
      ...rest,
      hasLiked,
      likeCount,
    };
  });
}

/**
 * Update a post — only the author can edit, and only within 24 hours of creation.
 */
export async function updatePost(postId, userId, { title, content }) {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.authorId !== userId) {
    throw new AppError("You can only edit your own posts", 403);
  }

  const hoursSinceCreation =
    (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new AppError("Posts can only be edited within 24 hours of creation", 403);
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { title, content },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
  return updated;
}

/**
 * Delete a post — only the author can delete their own post.
 */
export async function deletePost(postId, userId) {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.authorId !== userId) {
    throw new AppError("You can only delete your own posts", 403);
  }

  await prisma.post.delete({ where: { id: postId } });
  return { id: postId };
}

/**
 * Toggle like for a post
 */
export async function toggleLike(postId, userId) {
  const existing = await prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
    return { hasLiked: false };
  } else {
    await prisma.postLike.create({ data: { postId, userId } });
    return { hasLiked: true };
  }
}
