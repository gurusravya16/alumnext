import { useState } from "react";

function formatShortDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CommentSection({
  postId,
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
  currentUserName,
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await onAddComment?.(postId, trimmed);
      setText("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-[#1e3a5f] bg-[#0a1628]/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-white font-semibold">Comments</h4>
        <div className="text-xs text-[#8892a4]">
          {comments?.length ? `${comments.length} total` : "Be the first to comment"}
        </div>
      </div>

      <div className="mt-3 space-y-3 max-h-[280px] overflow-y-auto pr-1">
        {comments?.length ? (
          comments.map((c) => {
            const isMine =
              currentUserId != null &&
              String(c.authorId) === String(currentUserId);
            return (
              <div
                key={c.id}
                className="bg-[#112240] border border-[#1e3a5f] rounded-lg p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-white text-sm font-semibold truncate">
                    {c.authorName}
                  </div>
                  <div className="text-xs text-[#8892a4] whitespace-nowrap">
                    {formatShortDate(c.createdAt)}
                  </div>
                </div>
                <div className="text-[#cbd5e1] text-sm mt-1">
                  {c.text}
                </div>
                {isMine ? (
                  <button
                    type="button"
                    onClick={() => onDeleteComment?.(postId, c.id)}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 transition-all"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="text-[#8892a4] text-sm">
            No comments yet. Write the first one below.
          </div>
        )}
      </div>

      <form onSubmit={submit} className="mt-3 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add comment..."
          className="flex-1 rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

