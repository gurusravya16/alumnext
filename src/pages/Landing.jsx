import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Alum<span className="text-indigo-600">Next</span>
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Bridging the gap between alumni and students. Connect, collaborate,
          and unlock career opportunities within your university network.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 sm:w-auto"
          >
            Login
          </Link>
          <Link
            to="/signup/student"
            className="w-full rounded-lg border border-indigo-600 px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 sm:w-auto"
          >
            Register as Student
          </Link>
          <Link
            to="/signup/alumni"
            className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:w-auto"
          >
            Register as Alumni
          </Link>
        </div>
      </div>
    </div>
  );
}
