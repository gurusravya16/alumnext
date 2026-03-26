import { useState } from "react";

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-shadow text-sm";

export default function CreatePostForm({
  onSubmit,
  isLoading,
  error: externalError,
  onErrorClear,
}) {
  // Title maps to caption for backend compatibility.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const error = externalError || localError;

  const captionMax = 100;
  const descriptionMax = 2000;

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
      await onSubmit({ title: t, content: c, imageBase64 });
      setTitle("");
      setContent("");
      setImageBase64(null);
      setImagePreviewOpen(false);
    } catch {
      // Parent handles API errors
    }
  }

  async function onImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setImageBase64(result || null);
      setImagePreviewOpen(true);
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Create a post</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between gap-4 mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <span className="text-xs text-gray-500">{title.length}/{captionMax}</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, captionMax))}
            className={inputBase}
            placeholder="Post title"
            disabled={isLoading}
            maxLength={captionMax}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, descriptionMax))}
            className={`${inputBase} min-h-[100px] resize-y`}
            placeholder="Write something..."
            disabled={isLoading}
            rows={4}
            maxLength={descriptionMax}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Optional image
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            disabled={isLoading}
            onChange={onImageChange}
            className="text-sm text-gray-700"
          />
          {imageBase64 ? (
            <div className="mt-3">
              <img
                src={imageBase64}
                alt="Selected preview"
                className="w-full h-48 object-cover rounded-xl border border-gray-100"
              />
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
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
