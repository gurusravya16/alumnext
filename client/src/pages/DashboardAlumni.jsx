import { useEffect, useMemo, useState } from "react";
import AlumniCard from "../components/alumni/AlumniCard";
import { SearchIcon } from "../components/ui/OutlineIcons";
import { listAlumni } from "../services/alumniService";

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => String(a).localeCompare(String(b)));
}

export default function DashboardAlumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const branches = useMemo(
    () => uniqueSorted(alumni.map((a) => a.branch).filter(Boolean)),
    [alumni]
  );
  const years = useMemo(
    () =>
      uniqueSorted(
        alumni
          .map((a) => (a.year != null ? String(a.year) : ""))
          .filter(Boolean)
      ),
    [alumni]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await listAlumni({
          branch: branch || undefined,
          year: year ? Number(year) : undefined,
        });

        if (cancelled) return;
        // Map backend fields → UI-friendly shape used by AlumniCard.
        const mapped = data.map((a) => ({
          id: a.id,
          fullName: a.name,
          batchYear: a.year != null ? String(a.year) : "",
          branch: a.branch || "",
          branchFull: a.branch || "",
          linkedInUrl: a.linkedin || "",
          email: a.email || "",
          verified: true,
          // Optional fields not provided by backend yet:
          jobTitle: "",
          company: "",
          careerIndustry: "",
        }));
        setAlumni(mapped);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Failed to load alumni";
        setError(msg);
        setAlumni([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [branch, year]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alumni;
    return alumni.filter((a) => a.fullName?.toLowerCase?.().includes(q));
  }, [alumni, query]);

  const anyFilters = query.trim() || branch || year;

  function clearFilters() {
    setQuery("");
    setBranch("");
    setYear("");
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
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-3 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              >
                <option value="">Year</option>
                {years.map((y) => (
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

      {error ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center">
          <div className="text-white font-semibold">Failed to load alumni.</div>
          <div className="text-[#8892a4] text-sm mt-2">{error}</div>
          <button
            type="button"
            onClick={() => {
              setBranch("");
              setYear("");
            }}
            className="mt-5 rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-5 py-2.5 hover:brightness-110 transition-all"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center text-[#8892a4]">
          Loading alumni…
        </div>
      ) : filtered.length === 0 ? (
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

