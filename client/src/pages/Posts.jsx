import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostCard from "../components/posts/PostCard";

const DUMMY_POSTS = [
  { id: "1", title: "Welcome to AlumNext", content: "Share updates and connect with your network.", authorName: "Admin", authorId: 1, createdAt: new Date().toISOString() },
  { id: "2", title: "Career tips", content: "Always keep learning and building your network.", authorName: "Test User", authorId: 1, createdAt: new Date().toISOString() },
];

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(DUMMY_POSTS);

  function handleCreate({ title, content }) {
    const newPost = {
      id: String(Date.now()),
      title,
      content,
      authorName: user?.name || "Anonymous",
      authorId: user?.id,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function handleDelete(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const userId = user?.id;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-[#0B1F3A]">Posts</h2>
      <p className="mt-1 text-sm text-gray-500">Share updates and connect with your network.</p>

      <div className="mt-6">
        <CreatePostForm onSubmit={handleCreate} isLoading={false} />
      </div>

      <div className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-[#D4AF37]/10">
            <p className="text-gray-500 text-sm">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, authorName: post.authorName || "Anonymous" }}
              canDelete={userId != null && String(post.authorId) === String(userId)}
              onDelete={handleDelete}
              isDeleting={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
