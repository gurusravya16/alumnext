import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BRANCH_OPTIONS = ["Civil", "CSE", "ECE", "EEE", "IT", "Mechanical"];

function getPasswordStrength(pwd) {
  if (!pwd) return { label: "", level: 0 };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", level: 1 };
  if (score <= 4) return { label: "Medium", level: 2 };
  return { label: "Strong", level: 3 };
}

export default function AlumniSignup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    yearOfPassing: "",
    branch: "",
    jobProfile: "",
    company: "",
    linkedIn: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);
  const confirmError = form.confirmPassword && form.password !== form.confirmPassword;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      register({ ...form, name: form.fullName }, "alumni");
      navigate("/dashboard/posts");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 bg-[#0B1F3A]">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="rounded-xl border border-[#D4AF37]/40 bg-[#0B1F3A]/95 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white">Alumni Registration</h2>
          <p className="mt-2 text-sm text-gray-400">Join AlumNext and connect with students</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/20 border border-red-500/40 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Year of Passing</label>
              <input
                name="yearOfPassing"
                type="text"
                required
                value={form.yearOfPassing}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="e.g. 2020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
              <select
                name="branch"
                required
                value={form.branch}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
              >
                <option value="">Select branch</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Profile</label>
              <input
                name="jobProfile"
                type="text"
                required
                value={form.jobProfile}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
              <input
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">LinkedIn Profile <span className="text-gray-500">(optional)</span></label>
              <input
                name="linkedIn"
                type="url"
                value={form.linkedIn}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email ID</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
              <input
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Password"
              />
              {form.password && (
                <p className={`mt-1 text-xs ${strength.level === 1 ? "text-red-400" : strength.level === 2 ? "text-amber-400" : "text-green-400"}`}>
                  {strength.label}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 focus:outline-none"
                placeholder="Confirm password"
              />
              {(confirmError || error?.includes("match")) && (
                <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#D4AF37] text-[#0B1F3A] font-semibold py-3.5 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-[#D4AF37] hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Are you a student?{" "}
            <Link to="/signup/student" className="font-medium text-[#D4AF37] hover:underline">Register as Student</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
