import { useState } from "react";
import { Link } from "react-router-dom";
import CommentSection from "../alumni/CommentSection";
import { CheckIcon } from "../ui/OutlineIcons";

function formatTime(post) {
  return post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
}

function isWithin24Hours(createdAt) {
  if (!createdAt) return false;
  const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  return hours <= 24;
}

export default function PostCard({
  post,
  canDelete,
  canEdit,
  onDelete,
  onEdit,
  isDeleting,
  comments = [],
  onAddComment,
  onDeleteComment,
  currentUserId,
  currentUserName,
  liked = false,
  likeCount = 0,
  onToggleLike,
}) {
  const created = formatTime(post);
  const roleLabel = post?.authorRole
    ? String(post.authorRole).charAt(0).toUpperCase() +
      String(post.authorRole).slice(1)
    : "Alumni";

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);

  const editable = canEdit && isWithin24Hours(post.createdAt);

  async function handleSave() {
    if (!editTitle.trim() || !editContent.trim()) return;
    setSaving(true);
    try {
      await onEdit(post.id, { title: editTitle.trim(), content: editContent.trim() });
      setEditing(false);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="rounded-xl bg-[#112240] p-6 shadow-sm border border-[#1e3a5f] hover:shadow-md hover:border-[#f0b429]/40 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-[#1e3a5f] bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-[#D4AF37] text-white px-3 py-1.5 text-sm font-medium hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setEditTitle(post.title); setEditContent(post.content); }}
                  className="rounded-lg border border-[#1e3a5f] px-3 py-1.5 text-sm font-medium text-[#8892a4] hover:bg-[#1e3a5f]/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white break-words">{post.title}</h3>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <Link to={`/dashboard/profile/${post.authorId}`} className="text-sm text-[#8892a4] font-medium hover:text-[#f0b429] hover:underline transition-colors">
                  {post.authorName || "Anonymous"}
                </Link>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 text-[#f0b429] bg-[#D4AF37]/10 px-2 py-0.5 text-xs font-semibold">
                    <CheckIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {roleLabel}
                  </span>
              </div>
              <p className="mt-3 text-[#cbd5e1] text-sm leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </p>
              {post.localImageBase64 ? (
                <img
                  src={post.localImageBase64}
                  alt="Post attachment"
                  className="mt-4 w-full h-56 object-cover rounded-xl border border-[#1e3a5f]"
                />
              ) : null}
              <p className="mt-4 text-xs text-[#8892a4]">{created}</p>
            </>
          )}
        </div>
        {!editing && (
          <div className="flex flex-col gap-2 shrink-0">
            {editable && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-[#f0b429] hover:bg-[#f0b429]/10 transition-colors"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(post.id)}
                disabled={isDeleting}
                className="rounded-xl px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onToggleLike}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg border border-[#1e3a5f] px-3 py-2 text-[#cbd5e1] hover:bg-[#1e3a5f] transition-all"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={liked ? "text-[#D4AF37]" : "text-gray-500"}
          >
            <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6 9 4.6c-1.6-1.6-4.2-1.6-5.8 0s-1.6 4.2 0 5.8l8.8 8.8 8.8-8.8c1.6-1.6 1.6-4.2 0-5.8z" />
          </svg>
          {likeCount}
        </button>
      </div>

      <CommentSection
        postId={post.id}
        comments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
      />
    </article>
  );
}
