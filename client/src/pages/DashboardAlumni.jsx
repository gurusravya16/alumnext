import { useMemo, useState } from "react";
import AlumniCard from "../components/alumni/AlumniCard";
import { SearchIcon } from "../components/ui/OutlineIcons";

const STUDENT_ONLY_ALUMNI = [
  // Alumni
  {
    id: "1",
    fullName: "Subrahmanyam",
    batchYear: "2023",
    branch: "IT",
    branchFull: "Information Technology",
    careerIndustry: "Government",
    jobTitle: "Income Tax Officer",
    company: "Government of India",
    linkedInUrl: "https://www.linkedin.com/in/subrahmanyam-it/",
    bio: "Mentoring students on exams, documentation, and role-specific preparation.",
  },
  {
    id: "2",
    fullName: "Hema Malini",
    batchYear: "2019",
    branch: "ME",
    branchFull: "Mechanical",
    careerIndustry: "Core Mechanical",
    jobTitle: "Factory Manager",
    company: "Industrial Systems Pvt. Ltd.",
    linkedInUrl: "https://www.linkedin.com/in/hema-malini-mechanical/",
    bio: "Focused on production planning, shop-floor operations, and practical engineering growth.",
  },
  {
    id: "3",
    fullName: "Ravi Teja",
    batchYear: "2022",
    branch: "CSE",
    branchFull: "Computer Science",
    careerIndustry: "IT / Software",
    jobTitle: "Software Engineer",
    company: "Product Company",
    linkedInUrl: "https://www.linkedin.com/in/ravi-teja-cse/",
    bio: "Helping with DSA-to-production transition and building strong internship portfolios.",
  },
  {
    id: "4",
    fullName: "Sandeep Reddy",
    batchYear: "2021",
    branch: "ECE",
    branchFull: "Electronics",
    careerIndustry: "Electronics (ECE)",
    jobTitle: "Embedded Systems Engineer",
    company: "EmbeddedWorks",
    linkedInUrl: "https://www.linkedin.com/in/sandeep-reddy-ece/",
    bio: "Embedded fundamentals, debugging mindset, and project-based interview prep.",
  },
  {
    id: "5",
    fullName: "Lakshmi Priya",
    batchYear: "2020",
    branch: "EEE",
    branchFull: "Electrical",
    careerIndustry: "Electrical (EEE)",
    jobTitle: "Electrical Design Engineer",
    company: "PowerGrid Design",
    linkedInUrl: "https://www.linkedin.com/in/lakshmi-priya-eee/",
    bio: "Share hands-on electrical design workflows and career roadmaps.",
  },
  {
    id: "6",
    fullName: "Karthikeya",
    batchYear: "2018",
    branch: "CE",
    branchFull: "Civil",
    careerIndustry: "Civil / Infrastructure",
    jobTitle: "Site Engineer",
    company: "Infrastructure Projects",
    linkedInUrl: "https://www.linkedin.com/in/karthikeya-civil-site/",
    bio: "Practical guidance for civil internships, site exposure, and growth paths.",
  },
  {
    id: "7",
    fullName: "Anusha",
    batchYear: "2023",
    branch: "IT",
    branchFull: "Information Technology",
    careerIndustry: "IT / Software",
    jobTitle: "Data Analyst",
    company: "Analytics Studio",
    linkedInUrl: "https://www.linkedin.com/in/anusha-it-analytics/",
    bio: "Mentoring on dashboards, SQL analytics, and communicating results effectively.",
  },
  {
    id: "8",
    fullName: "Praveen Kumar",
    batchYear: "2017",
    branch: "ME",
    branchFull: "Mechanical",
    careerIndustry: "Core Mechanical",
    jobTitle: "Production Supervisor",
    company: "Manufacturing Partner",
    linkedInUrl: "https://www.linkedin.com/in/praveen-kumar-mechanical/",
    bio: "Support with industrial exposure, quality thinking, and continuous improvement habits.",
  },
  {
    id: "9",
    fullName: "Srikanth",
    batchYear: "2019",
    branch: "CSE",
    branchFull: "Computer Science",
    careerIndustry: "IT / Software",
    jobTitle: "Backend Developer",
    company: "Cloud Services",
    linkedInUrl: "https://www.linkedin.com/in/srikanth-cse-backend/",
    bio: "Backend learning paths, system design basics, and building scalable services.",
  },
  {
    id: "10",
    fullName: "Divya",
    batchYear: "2022",
    branch: "ECE",
    branchFull: "Electronics",
    careerIndustry: "Electronics (ECE)",
    jobTitle: "VLSI Engineer",
    company: "Chip Design Lab",
    linkedInUrl: "https://www.linkedin.com/in/divya-ece-vlsi/",
    bio: "Guidance on VLSI learning plan, tooling comfort, and project presentation.",
  },

  // Professors (shown in the same directory for now)
  {
    id: "p1",
    fullName: "Dr. Raghuram",
    batchYear: "2008",
    branch: "ME",
    branchFull: "Mechanical",
    careerIndustry: "Core Mechanical",
    jobTitle: "HOD, Mechanical",
    company: "Research (Thermal Systems)",
    linkedInUrl: "https://www.linkedin.com/in/dr-raghuram-mechanical/",
    bio: "Research guidance on thermal systems, experimentation, and publication-ready framing.",
  },
  {
    id: "p2",
    fullName: "Prof. Srilatha",
    batchYear: "2009",
    branch: "CSE",
    branchFull: "Computer Science",
    careerIndustry: "IT / Software",
    jobTitle: "Professor, CSE",
    company: "AI & ML Specialization",
    linkedInUrl: "https://www.linkedin.com/in/prof-srilatha-cse-ai-ml/",
    bio: "Mentorship on AI/ML fundamentals and turning projects into measurable outcomes.",
  },
  {
    id: "p3",
    fullName: "Dr. Naresh",
    batchYear: "2010",
    branch: "CE",
    branchFull: "Civil",
    careerIndustry: "Civil / Infrastructure",
    jobTitle: "Professor, Civil",
    company: "Structural Engineering",
    linkedInUrl: "https://www.linkedin.com/in/dr-naresh-civil-structural/",
    bio: "Support for structural thinking, design concepts, and career direction in civil engineering.",
  },
];

const CAREER_INDUSTRY_OPTIONS = [
  "Government",
  "IT / Software",
  "Core Mechanical",
  "Civil / Infrastructure",
  "Electronics (ECE)",
  "Electrical (EEE)",
];

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => String(a).localeCompare(String(b)));
}

export default function DashboardAlumni() {
  const ALUMNI = STUDENT_ONLY_ALUMNI;

  const batchYears = useMemo(
    () => uniqueSorted(ALUMNI.map((a) => a.batchYear)),
    []
  );
  const branches = useMemo(
    () => uniqueSorted(ALUMNI.map((a) => a.branch)),
    []
  );
  const industries = useMemo(
    () =>
      uniqueSorted([
        ...CAREER_INDUSTRY_OPTIONS,
        ...ALUMNI.map((a) => a.careerIndustry),
      ]),
    []
  );

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
          <div className="text-[#f0b429] flex items-center justify-center mb-1">
            <SearchIcon className="w-7 h-7" />
          </div>
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

