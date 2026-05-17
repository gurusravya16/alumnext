import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostCard from "../components/posts/PostCard";

function normalizePost(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorName: post.author?.name ?? "Anonymous",
    authorId: post.authorId,
    authorRole: post.author?.role ?? "alumni",
    createdAt: post.createdAt,
  };
}

function PostSkeleton() {
  return (
    <div className="rounded-xl bg-[#112240] p-6 shadow-sm border border-[#1e3a5f] animate-pulse">
      <div className="h-5 bg-[#1e3a5f] rounded w-3/4" />
      <div className="mt-2 h-4 bg-[#0a1628] rounded w-1/4" />
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-[#0a1628] rounded w-full" />
        <div className="h-3 bg-[#0a1628] rounded w-5/6" />
        <div className="h-3 bg-[#0a1628] rounded w-4/6" />
      </div>
      <div className="mt-4 h-3 bg-[#0a1628] rounded w-1/3" />
    </div>
  );
}

export default function Posts() {
  const { user, role } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [commentsByPostId, setCommentsByPostId] = useState({});
  const [likesByPostId, setLikesByPostId] = useState({});

  const canCreate = role === "alumni";

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/posts");
      const list = data?.data?.posts ?? data?.posts ?? [];
      setPosts(Array.isArray(list) ? list.map(normalizePost) : []);

      const initialLikes = {};
      if (Array.isArray(list)) {
        list.forEach((p) => {
          initialLikes[p.id] = { liked: p.hasLiked, count: p.likeCount || 0 };
        });
      }
      setLikesByPostId(initialLikes);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg === "Network Error" ? "Cannot connect to server. Please try again." : msg);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleCreate({ title, content, imageBase64 }) {
    setCreateError("");
    setCreateLoading(true);
    try {
      const { data } = await api.post("/posts", { title, content });
      const post = data?.data?.post ?? data?.post;
      if (post) {
        const normalized = normalizePost(post);
        // TODO: Upload `imageBase64` to backend/storage and associate it with the created post.
        setPosts((prev) => [
          { ...normalized, localImageBase64: imageBase64 || null },
          ...prev,
        ]);
      } else {
        await fetchPosts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setCreateError(msg === "Network Error" ? "Cannot connect to server. Please try again." : msg);
      throw err;
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg === "Network Error" ? "Cannot connect to server. Please try again." : msg);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleEdit(id, { title, content }) {
    const { data } = await api.put(`/posts/${id}`, { title, content });
    const updated = data?.data?.post ?? data?.post;
    if (updated) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...normalizePost(updated) } : p))
      );
    }
  }

  const userId = user?.id;
  const currentUserName = user?.name || "Anonymous";

  function onAddComment(postId, text) {
    if (!userId) return;
    // TODO: POST /api/posts/:id/comments and persist comments server-side.
    setCommentsByPostId((prev) => {
      const existing = prev[postId] ?? [];
      const newComment = {
        id: String(Date.now()),
        authorId: userId,
        authorName: currentUserName,
        text,
        createdAt: new Date().toISOString(),
      };
      return { ...prev, [postId]: [newComment, ...existing] };
    });
  }

  function onDeleteComment(postId, commentId) {
    if (!userId) return;
    // TODO: DELETE /api/posts/:id/comments/:commentId.
    setCommentsByPostId((prev) => {
      const existing = prev[postId] ?? [];
      const updated = existing.filter((c) => {
        if (String(c.id) !== String(commentId)) return true;
        return String(c.authorId) !== String(userId);
      });
      return { ...prev, [postId]: updated };
    });
  }

  async function toggleLike(postId) {
    setLikesByPostId((prev) => {
      const current = prev[postId] ?? { liked: false, count: 0 };
      const nextLiked = !current.liked;
      const nextCount = nextLiked ? current.count + 1 : Math.max(0, current.count - 1);
      return { ...prev, [postId]: { liked: nextLiked, count: nextCount } };
    });

    try {
      await api.post(`/posts/${postId}/like`);
    } catch (err) {
      // Revert if error occurs mapping back to prev
      setLikesByPostId((prev) => {
        const current = prev[postId] ?? { liked: true, count: 1 };
        const revertedLiked = !current.liked;
        const revertedCount = revertedLiked ? current.count + 1 : Math.max(0, current.count - 1);
        return { ...prev, [postId]: { liked: revertedLiked, count: revertedCount } };
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white">Posts</h2>
      <p className="mt-1 text-sm text-[#8892a4]">Share updates and connect with your network.</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => { setError(null); fetchPosts(); }}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-6">
        {canCreate ? (
          <CreatePostForm
            onSubmit={async (data) => {
              const confirmed = window.confirm(
                "Warning: You can only edit or delete this post within 24 hours of publishing.\n\nAre you sure you want to proceed?"
              );
              if (!confirmed) return;
              await handleCreate(data);
            }}
            isLoading={createLoading}
            error={createError}
            onErrorClear={() => setCreateError("")}
          />
        ) : (
          <div className="rounded-xl border border-[#1e3a5f] bg-[#0a1628]/50 p-4 text-sm text-[#8892a4]">
            Posts are view-only for students. Alumni can create posts.
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="rounded-xl bg-[#112240] p-12 text-center shadow-sm border border-[#1e3a5f]">
            <p className="text-[#8892a4] text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canDelete={userId != null && String(post.authorId) === String(userId)}
              canEdit={canCreate && userId != null && String(post.authorId) === String(userId)}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isDeleting={deletingId === post.id}
              comments={commentsByPostId[post.id] ?? []}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              currentUserId={userId}
              currentUserName={currentUserName}
              liked={likesByPostId[post.id]?.liked ?? false}
              likeCount={likesByPostId[post.id]?.count ?? 0}
              onToggleLike={() => toggleLike(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
