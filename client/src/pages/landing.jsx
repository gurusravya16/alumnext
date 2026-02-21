import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const logoImg = "/images/logo.png";
const logoFallback = "/images/logo.jpg";
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
};

const stagger = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

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

const inputBase =
  "w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-200";

const BRANCH_OPTIONS = ["Civil", "CSE", "ECE", "EEE", "IT", "Mechanical"];

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="relative text-gray-200 text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-300 py-2 after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-[width] after:duration-300 hover:after:w-full"
    >
      {children}
    </a>
  );
}

function RegistrationForm({ role, onClose }) {
  const [errors, setErrors] = useState({});
  const [student, setStudent] = useState({
    fullName: "", username: "", rollNumber: "", branch: "", year: "", email: "", phone: "", profileFile: null, password: "", confirmPassword: "",
  });
  const [alumni, setAlumni] = useState({
    fullName: "", username: "", yearOfPassing: "", branch: "", jobProfile: "", company: "", linkedIn: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const pwd = role === "student" ? student.password : alumni.password;
  const strength = getPasswordStrength(pwd);
  const confirmPwd = role === "student" ? student.confirmPassword : alumni.confirmPassword;
  const confirmError = confirmPwd && pwd !== confirmPwd;

  const updateStudent = (key, value) => setStudent((s) => ({ ...s, [key]: value }));
  const updateAlumni = (key, value) => setAlumni((a) => ({ ...a, [key]: value }));

  const validate = () => {
    const e = {};
    if (role === "student") {
      if (!student.fullName.trim()) e.fullName = "Required";
      if (!student.username.trim()) e.username = "Required";
      if (!student.rollNumber.trim()) e.rollNumber = "Required";
      if (!student.branch.trim()) e.branch = "Required";
      if (!student.year.trim()) e.year = "Required";
      if (!student.email.trim()) e.email = "Required";
      if (!student.phone.trim()) e.phone = "Required";
      if (!student.password) e.password = "Required";
      if (student.password !== student.confirmPassword) e.confirmPassword = "Passwords do not match";
    } else {
      if (!alumni.fullName.trim()) e.fullName = "Required";
      if (!alumni.username.trim()) e.username = "Required";
      if (!alumni.yearOfPassing.trim()) e.yearOfPassing = "Required";
      if (!alumni.branch.trim()) e.branch = "Required";
      if (!alumni.jobProfile.trim()) e.jobProfile = "Required";
      if (!alumni.company.trim()) e.company = "Required";
      if (!alumni.email.trim()) e.email = "Required";
      if (!alumni.phone.trim()) e.phone = "Required";
      if (!alumni.password) e.password = "Required";
      if (alumni.password !== alumni.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // No API yet
    onClose();
  };

  const formSlide = { initial: { opacity: 0, x: role === "student" ? -12 : 12 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: role === "student" ? 12 : -12 }, transition: { duration: 0.2 } };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AnimatePresence mode="wait">
      <motion.div key={role} {...formSlide} className="space-y-5">
        <h2 className="text-xl font-semibold text-white border-b border-[#D4AF37]/40 pb-2">
          {role === "student" ? "Student Registration" : "Alumni Registration"}
        </h2>

        {role === "student" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input type="text" value={student.fullName} onChange={(ev) => updateStudent("fullName", ev.target.value)} className={inputBase} placeholder="Enter full name" />
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input type="text" value={student.username} onChange={(ev) => updateStudent("username", ev.target.value)} className={inputBase} placeholder="Choose a username" />
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Roll Number</label>
              <input type="text" value={student.rollNumber} onChange={(ev) => updateStudent("rollNumber", ev.target.value)} className={inputBase} placeholder="Roll number" />
              {errors.rollNumber && <p className="mt-1 text-sm text-red-400">{errors.rollNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
              <select value={student.branch} onChange={(ev) => updateStudent("branch", ev.target.value)} className={inputBase}>
                <option value="">Select branch</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.branch && <p className="mt-1 text-sm text-red-400">{errors.branch}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Year</label>
              <input type="text" value={student.year} onChange={(ev) => updateStudent("year", ev.target.value)} className={inputBase} placeholder="e.g. 2024" />
              {errors.year && <p className="mt-1 text-sm text-red-400">{errors.year}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email ID</label>
              <input type="email" value={student.email} onChange={(ev) => updateStudent("email", ev.target.value)} className={inputBase} placeholder="email@example.com" />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
              <input type="tel" value={student.phone} onChange={(ev) => updateStudent("phone", ev.target.value)} className={inputBase} placeholder="Phone number" />
              {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Profile Picture</label>
              <label className="flex flex-col items-center justify-center w-full rounded-xl border border-dashed border-[#D4AF37]/40 bg-white/5 py-6 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(ev) => updateStudent("profileFile", ev.target.files?.[0] ?? null)} />
                <span className="text-sm text-gray-400">{student.profileFile ? student.profileFile.name : "Choose file or drag here"}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input type="password" value={student.password} onChange={(ev) => updateStudent("password", ev.target.value)} className={inputBase} placeholder="Password" />
              {pwd && <p className={`mt-1 text-xs ${strength.level === 1 ? "text-red-400" : strength.level === 2 ? "text-amber-400" : "text-green-400"}`}>{strength.label}</p>}
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <input type="password" value={student.confirmPassword} onChange={(ev) => updateStudent("confirmPassword", ev.target.value)} className={inputBase} placeholder="Confirm password" />
              {(confirmError || errors.confirmPassword) && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword || "Passwords do not match"}</p>}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input type="text" value={alumni.fullName} onChange={(ev) => updateAlumni("fullName", ev.target.value)} className={inputBase} placeholder="Enter full name" />
              {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input type="text" value={alumni.username} onChange={(ev) => updateAlumni("username", ev.target.value)} className={inputBase} placeholder="Choose a username" />
              {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Year of Passing</label>
              <input type="text" value={alumni.yearOfPassing} onChange={(ev) => updateAlumni("yearOfPassing", ev.target.value)} className={inputBase} placeholder="e.g. 2020" />
              {errors.yearOfPassing && <p className="mt-1 text-sm text-red-400">{errors.yearOfPassing}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
              <select value={alumni.branch} onChange={(ev) => updateAlumni("branch", ev.target.value)} className={inputBase}>
                <option value="">Select branch</option>
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.branch && <p className="mt-1 text-sm text-red-400">{errors.branch}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Job Profile</label>
              <input type="text" value={alumni.jobProfile} onChange={(ev) => updateAlumni("jobProfile", ev.target.value)} className={inputBase} placeholder="Job title" />
              {errors.jobProfile && <p className="mt-1 text-sm text-red-400">{errors.jobProfile}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
              <input type="text" value={alumni.company} onChange={(ev) => updateAlumni("company", ev.target.value)} className={inputBase} placeholder="Company name" />
              {errors.company && <p className="mt-1 text-sm text-red-400">{errors.company}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">LinkedIn Profile <span className="text-gray-500">(optional)</span></label>
              <input type="url" value={alumni.linkedIn} onChange={(ev) => updateAlumni("linkedIn", ev.target.value)} className={inputBase} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email ID</label>
              <input type="email" value={alumni.email} onChange={(ev) => updateAlumni("email", ev.target.value)} className={inputBase} placeholder="email@example.com" />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
              <input type="tel" value={alumni.phone} onChange={(ev) => updateAlumni("phone", ev.target.value)} className={inputBase} placeholder="Phone number" />
              {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input type="password" value={alumni.password} onChange={(ev) => updateAlumni("password", ev.target.value)} className={inputBase} placeholder="Password" />
              {pwd && <p className={`mt-1 text-xs ${strength.level === 1 ? "text-red-400" : strength.level === 2 ? "text-amber-400" : "text-green-400"}`}>{strength.label}</p>}
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <input type="password" value={alumni.confirmPassword} onChange={(ev) => updateAlumni("confirmPassword", ev.target.value)} className={inputBase} placeholder="Confirm password" />
              {(confirmError || errors.confirmPassword) && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword || "Passwords do not match"}</p>}
            </div>
          </>
        )}
      </motion.div>
      </AnimatePresence>

      <motion.button
        type="submit"
        className="w-full rounded-xl bg-[#D4AF37] text-[#0B1F3A] font-semibold py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
      >
        {role === "student" ? "Register as Student" : "Register as Alumni"}
      </motion.button>
    </form>
  );
}

const modalBackdrop =
  "fixed inset-0 z-[100] flex items-center justify-center p-4";
const modalOverlay = "absolute inset-0 bg-black/60";
const modalPanel =
  "relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/40 bg-[#0B1F3A] shadow-[0_0_40px_rgba(212,175,55,0.15)]";
const modalCloseBtn =
  "absolute top-4 right-4 z-10 rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors";
const modalEnter = { initial: { opacity: 0, scale: 0.92, y: 8 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.92, y: 8 }, transition: { duration: 0.25, ease: [0.42, 0, 0.58, 1] } };

function LoginForm({ role, onClose }) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = {};
    if (!emailOrUsername.trim()) e2.emailOrUsername = "Required";
    if (!password) e2.password = "Required";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    // No backend yet
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-white border-b border-[#D4AF37]/40 pb-2">
        {role === "student" ? "Student Login" : "Alumni Login"}
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email ID or Username</label>
        <input
          type="text"
          value={emailOrUsername}
          onChange={(ev) => setEmailOrUsername(ev.target.value)}
          className={inputBase}
          placeholder="Email or username"
        />
        {errors.emailOrUsername && <p className="mt-1 text-sm text-red-400">{errors.emailOrUsername}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className={inputBase}
          placeholder="Password"
        />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
      </div>
      <div className="flex justify-end">
        <button type="button" className="text-sm text-[#D4AF37] hover:underline underline-offset-2 transition-colors">
          Forgot Password?
        </button>
      </div>
      <motion.button
        type="submit"
        className="w-full rounded-xl bg-[#D4AF37] text-[#0B1F3A] font-semibold py-3.5 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
      >
        {role === "student" ? "Login as Student" : "Login as Alumni"}
      </motion.button>
    </form>
  );
}

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState("student");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState("student");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const anyModalOpen = modalOpen || loginModalOpen;
  useEffect(() => {
    if (!anyModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => {
      if (e.key !== "Escape") return;
      if (loginModalOpen) setLoginModalOpen(false);
      else if (modalOpen) setModalOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [anyModalOpen, modalOpen, loginModalOpen]);

  return (
    <div
      className="min-h-screen bg-[#0B1F3A] text-gray-100 antialiased"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Registration Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className={modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalOpen(false)}
          >
            <div className={modalOverlay} />
            <motion.div
              className={modalPanel}
              {...modalEnter}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                className={modalCloseBtn}
                onClick={() => setModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-6 sm:p-8 pt-12">
                {/* Role Toggle */}
                <div className="flex rounded-full border border-[#D4AF37]/40 p-1 mb-8">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ${role === "student" ? "bg-[#D4AF37] text-[#0B1F3A]" : "bg-transparent text-[#D4AF37] border border-transparent hover:bg-white/5"}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("alumni")}
                    className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ${role === "alumni" ? "bg-[#D4AF37] text-[#0B1F3A]" : "bg-transparent text-[#D4AF37] border border-transparent hover:bg-white/5"}`}
                  >
                    Alumni
                  </button>
                </div>

                <RegistrationForm role={role} onClose={() => setModalOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div
            className={modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLoginModalOpen(false)}
          >
            <div className={modalOverlay} />
            <motion.div
              className={modalPanel}
              {...modalEnter}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                className={modalCloseBtn}
                onClick={() => setLoginModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-6 sm:p-8 pt-12">
                <LoginForm role={loginRole} onClose={() => setLoginModalOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#122B52] backdrop-blur-md border-b-2 border-[#D4AF37]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <a href="/" className="flex-shrink-0 block rounded-full overflow-hidden border-2 border-[#D4AF37]/30 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
            <img
              src={logoImg}
              alt="AlumNext"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logoFallback;
              }}
            />
          </a>
          <nav className="flex items-center gap-6 sm:gap-8">
            <button
              type="button"
              onClick={() => { setLoginRole("student"); setLoginModalOpen(true); }}
              className="relative text-gray-200 text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-300 py-2 after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-[width] after:duration-300 hover:after:w-full"
            >
              Login as Student
            </button>
            <button
              type="button"
              onClick={() => { setLoginRole("alumni"); setLoginModalOpen(true); }}
              className="relative text-gray-200 text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-300 py-2 after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-[width] after:duration-300 hover:after:w-full"
            >
              Login as Alumni
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B1F3A]">
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#D4AF37] tracking-tight"
            >
              AlumNext
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight"
            >
              Bridging Students and Alumni for Career Growth
            </motion.h1>
            <motion.div variants={fadeInUp} className="pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-block px-8 py-3.5 rounded-xl bg-[#D4AF37] text-[#0B1F3A] font-semibold hover:brightness-110 transition-all duration-300"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* For Students - image half column left, text half right */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-[#0B1F3A] border-t-2 border-[#D4AF37]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <motion.div
              className="relative w-full aspect-[4/3] lg:aspect-auto lg:min-h-[360px] rounded-lg overflow-hidden border border-[#D4AF37]/20"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/student.jpg"
                alt="Students"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/student.jpeg";
                }}
              />
            </motion.div>
            <div className="lg:pl-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-white border-b border-[#D4AF37]/40 pb-2 inline-block"
            >
              For Students
            </motion.h2>
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3 mt-6 text-gray-300 text-base sm:text-lg"
            >
              {[
                "Connect with verified alumni",
                "Book structured mentorship sessions",
                "Access curated job opportunities",
                "Track placement activities",
                "Build professional network",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1.5 flex-shrink-0 text-lg">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Alumni - image half column right, text half left */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-[#0B1F3A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="lg:order-2">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-white border-b border-[#D4AF37]/40 pb-2 inline-block"
              >
                For Alumni
              </motion.h2>
              <motion.ul
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-3 mt-6 text-gray-300 text-base sm:text-lg"
              >
                {[
                  "Post job openings",
                  "Offer mentorship slots",
                  "Engage with students professionally",
                  "Expand institutional network",
                  "Track mentorship impact",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1.5 flex-shrink-0 text-lg">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </div>
            <motion.div
              className="relative w-full aspect-[4/3] lg:aspect-auto lg:min-h-[360px] rounded-lg overflow-hidden border border-[#D4AF37]/20 lg:order-1"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/alumni.jpg"
                alt="Alumni"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/alumni.jpeg";
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Training & Placement - image half left, text half right */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-[#0B1F3A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <motion.div
              className="relative w-full aspect-[4/3] lg:aspect-auto lg:min-h-[360px] rounded-lg overflow-hidden border border-[#D4AF37]/20"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/t&p.jpg"
                alt="Training and Placement"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/t&p.jpeg";
                }}
              />
            </motion.div>
            <div className="lg:pl-4">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-white border-b border-[#D4AF37]/40 pb-2 inline-block"
              >
                For Training & Placement Cell
              </motion.h2>
              <motion.ul
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-3 mt-6 text-gray-300 text-base sm:text-lg"
              >
                {[
                  "Verify alumni registrations",
                  "Moderate job postings",
                  "Monitor engagement analytics",
                  "Track placement trends",
                  "Institutional oversight dashboard",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1.5 flex-shrink-0 text-lg">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0B1F3A]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-8">
            Follow Us
          </h2>
          <div className="flex justify-center gap-8">
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm0 2.622h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-3.205a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" clipRule="evenodd" />
              </svg>
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/30 bg-[#0B1F3A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AlumNext. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
