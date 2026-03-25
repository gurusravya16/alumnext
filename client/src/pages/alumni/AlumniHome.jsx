import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AlumniHome() {
  const { user } = useAuth();
  const name = user?.name || "Alumni";

  const activity = useMemo(
    () => [
      { id: "a1", text: "You posted a new job opening — Software Engineer Intern", date: "2026-03-01" },
      { id: "a2", text: "New mentorship request from Student Name", date: "2026-03-10" },
      { id: "a3", text: "Session confirmed with Student Name", date: "2026-03-18" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Welcome back, {name}</h1>
        <p className="text-[#8892a4] mt-2">
          {/** TODO: fetch alumni profile data like current role/company */}
          Current role: Alumni · Company: Company
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-white font-bold text-2xl">12</div>
            <div className="text-[#8892a4] text-sm mt-1">Advertisements Posted</div>
          </div>
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-white font-bold text-2xl">5</div>
            <div className="text-[#8892a4] text-sm mt-1">Mentorship Requests Pending</div>
          </div>
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-white font-bold text-2xl">3</div>
            <div className="text-[#8892a4] text-sm mt-1">Sessions Confirmed</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <div className="space-y-3">
          {activity.map((item) => (
            <div
              key={item.id}
              className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between gap-4"
            >
              <div className="text-white text-sm">{item.text}</div>
              <div className="text-[#8892a4] text-xs whitespace-nowrap">
                {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

