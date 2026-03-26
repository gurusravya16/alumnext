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

export default function PostCard({
  post,
  canDelete,
  onDelete,
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

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200/80 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 break-words">{post.title}</h3>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <p className="text-sm text-gray-500 font-medium">
              {post.authorName || "Anonymous"}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 text-[#0B1F3A] bg-[#D4AF37]/10 px-2 py-0.5 text-xs font-semibold">
              <CheckIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
              {roleLabel}
            </span>
          </div>
          <p className="mt-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
          {post.localImageBase64 ? (
            <img
              src={post.localImageBase64}
              alt="Post attachment"
              className="mt-4 w-full h-56 object-cover rounded-xl border border-gray-100"
            />
          ) : null}
          <p className="mt-4 text-xs text-gray-400">{created}</p>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            disabled={isDeleting}
            className="flex-shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onToggleLike}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-all"
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
