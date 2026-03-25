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
    createdAt: post.createdAt,
  };
}

function PostSkeleton() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="mt-2 h-4 bg-gray-100 rounded w-1/4" />
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="mt-4 h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/posts");
      const list = data?.data?.posts ?? data?.posts ?? [];
      setPosts(Array.isArray(list) ? list.map(normalizePost) : []);
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

  async function handleCreate({ title, content }) {
    setCreateError("");
    setCreateLoading(true);
    try {
      const { data } = await api.post("/posts", { title, content });
      const post = data?.data?.post ?? data?.post;
      if (post) {
        setPosts((prev) => [normalizePost(post), ...prev]);
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

  const userId = user?.id;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-[#0B1F3A]">Posts</h2>
      <p className="mt-1 text-sm text-gray-500">Share updates and connect with your network.</p>

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
        <CreatePostForm
          onSubmit={handleCreate}
          isLoading={createLoading}
          error={createError}
          onErrorClear={() => setCreateError("")}
        />
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-[#D4AF37]/10">
            <p className="text-gray-500 text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              canDelete={userId != null && String(post.authorId) === String(userId)}
              onDelete={handleDelete}
              isDeleting={deletingId === post.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
