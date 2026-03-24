export default function PostCard({ post, canDelete, onDelete, isDeleting }) {
  const created = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200/80 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{post.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{post.authorName || "Anonymous"}</p>
          <p className="mt-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
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
    </article>
  );
}
