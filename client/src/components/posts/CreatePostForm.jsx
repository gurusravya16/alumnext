import { useState } from "react";

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-shadow text-sm";

export default function CreatePostForm({ onSubmit, isLoading, error: externalError, onErrorClear }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [localError, setLocalError] = useState("");

  const error = externalError || localError;

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    onErrorClear?.();
    const t = title.trim();
    const c = content.trim();
    if (!t) {
      setLocalError("Title is required");
      return;
    }
    if (!c) {
      setLocalError("Content is required");
      return;
    }
    try {
      await onSubmit({ title: t, content: c });
      setTitle("");
      setContent("");
    } catch {
      // Parent handles API errors
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Create a post</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputBase}
            placeholder="Post title"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputBase} min-h-[100px] resize-y`}
            placeholder="Write something..."
            disabled={isLoading}
            rows={4}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#D4AF37] text-[#0B1F3A] py-2.5 text-sm font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
