import { useMemo, useState } from "react";
import CommentSection from "./CommentSection";

function formatDateTime(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AlumniPostCard({
  post,
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
  currentUserName,
}) {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 220;

  const content = post?.content || "";
  const needsTruncate = content.length > maxChars;

  const preview = useMemo(() => {
    if (!needsTruncate) return content;
    return content.slice(0, maxChars);
  }, [content, needsTruncate]);

  return (
    <article className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-white font-bold text-lg break-words">
            {post?.title}
          </h3>
          <div className="text-[#8892a4] text-xs mt-1">
            {formatDateTime(post?.createdAt)}
          </div>
        </div>
      </div>

      <p className="text-[#cbd5e1] text-sm mt-3 whitespace-pre-wrap break-words">
        {expanded || !needsTruncate ? content : `${preview}...`}
      </p>

      {needsTruncate ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-semibold text-[#f0b429] hover:brightness-110 transition-all"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      ) : null}

      {/* TODO: Sprint 4 - backend comments */}
      <CommentSection
        postId={post?.id}
        comments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
      />
    </article>
  );
}

