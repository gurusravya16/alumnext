import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 bg-[#0B1F3A]">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-[#D4AF37]">404</h1>
        <p className="mt-4 text-lg text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-[#D4AF37] text-[#0B1F3A] px-6 py-3 text-sm font-semibold hover:brightness-110"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
