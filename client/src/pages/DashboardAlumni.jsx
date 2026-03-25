import { useMemo, useState } from "react";
import AlumniCard from "../components/alumni/AlumniCard";

const ALUMNI = [
  {
    id: "1",
    fullName: "Aarav Mehta",
    batchYear: "2020",
    branch: "CSE",
    branchFull: "Computer Science",
    careerIndustry: "Software",
    jobTitle: "Software Engineer",
    company: "Google",
    linkedInUrl: "https://www.linkedin.com/",
    bio:
      "I help students build interview-ready skills and navigate early career growth.",
  },
  {
    id: "2",
    fullName: "Riya Kapoor",
    batchYear: "2019",
    branch: "ECE",
    branchFull: "Electronics",
    careerIndustry: "Research",
    jobTitle: "Research Associate",
    company: "NanoGrid",
    linkedInUrl: "",
    bio:
      "Happy to share research workflows and tips for switching paths into deep tech.",
  },
  {
    id: "3",
    fullName: "Vikram Singh",
    batchYear: "2021",
    branch: "ME",
    branchFull: "Mechanical",
    careerIndustry: "Finance",
    jobTitle: "Business Analyst",
    company: "FinVista",
    linkedInUrl: "https://www.linkedin.com/",
    bio:
      "Focused on turning analytics into actionable decisions. Mentoring students on data stories.",
  },
  {
    id: "4",
    fullName: "Neha Sharma",
    batchYear: "2018",
    branch: "CE",
    branchFull: "Civil",
    careerIndustry: "Healthcare",
    jobTitle: "Project Coordinator",
    company: "CareWorks",
    linkedInUrl: "",
    bio: "From campus projects to real-world delivery. Ask me about resilience and planning.",
  },
];

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => String(a).localeCompare(String(b)));
}

export default function DashboardAlumni() {
  const batchYears = useMemo(() => uniqueSorted(ALUMNI.map((a) => a.batchYear)), []);
  const branches = useMemo(() => uniqueSorted(ALUMNI.map((a) => a.branch)), []);
  const industries = useMemo(() => uniqueSorted(ALUMNI.map((a) => a.careerIndustry)), []);

  const [query, setQuery] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [branch, setBranch] = useState("");
  const [industry, setIndustry] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALUMNI.filter((a) => {
      if (q && !a.fullName.toLowerCase().includes(q)) return false;
      if (batchYear && a.batchYear !== batchYear) return false;
      if (branch && a.branch !== branch) return false;
      if (industry && a.careerIndustry !== industry) return false;
      return true;
    });
  }, [query, batchYear, branch, industry]);

  const anyFilters = query.trim() || batchYear || branch || industry;

  function clearFilters() {
    setQuery("");
    setBatchYear("");
    setBranch("");
    setIndustry("");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Alumni Network</h1>
          <p className="text-[#8892a4] text-sm mt-1">
            Search and connect with alumni mentors
          </p>
        </div>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="flex-1 min-w-[220px] rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
            <div className="flex gap-3 flex-wrap">
              <select
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-3 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              >
                <option value="">Batch Year</option>
                {batchYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-3 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              >
                <option value="">Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-3 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              >
                <option value="">Career / Industry</option>
                {industries.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={clearFilters}
                disabled={!anyFilters}
                className="rounded-lg border border-[#f0b429]/40 text-[#f0b429] px-4 py-2.5 text-sm font-semibold hover:bg-[#f0b429]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center">
          <div className="text-[#f0b429] text-3xl font-bold">🔎</div>
          <div className="text-white font-semibold mt-3">
            No alumni found matching your filters.
          </div>
          <div className="text-[#8892a4] text-sm mt-2">
            Try adjusting your search or press “Clear Filters”.
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-5 py-2.5 hover:brightness-110 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AlumniCard key={a.id} alumni={a} />
          ))}
        </div>
      )}
    </div>
  );
}

