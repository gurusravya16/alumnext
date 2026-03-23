import prisma from "../../lib/prisma.js";
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
export async function listPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
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
