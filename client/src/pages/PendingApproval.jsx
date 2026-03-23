import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PendingApproval() {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-lg bg-white p-8 shadow-md">
          {/* Clock/hourglass icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Your account is under review
          </h2>

          {user && (
            <p className="mt-2 text-sm text-gray-500">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Thank you for registering as an alumni! To maintain the quality and
            trust of our community, all alumni accounts are manually reviewed
            before approval.
          </p>

          <div className="mt-6 rounded-md bg-blue-50 p-4 text-left">
            <h3 className="text-sm font-semibold text-blue-800">
              What happens next?
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• Our team will verify your credentials</li>
              <li>• This usually takes <strong>24–48 hours</strong></li>
              <li>• You&apos;ll be able to access the full platform once approved</li>
            </ul>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <a
                href="mailto:support@alumnext.com"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Contact support
              </a>
            </p>

            <button
              onClick={logout}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Logout
            </button>

            <Link
              to="/"
              className="block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
