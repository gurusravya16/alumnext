import { useNavigate } from "react-router-dom";

export default function DashboardMentorship() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 flex flex-col items-center text-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-white">Mentorship</h1>
        <p className="text-[#8892a4] mt-2">
          Your mentorship sessions will appear here. Browse alumni and request
          a session to get started.
        </p>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-8 shadow-sm w-full max-w-3xl">
        <div className="text-5xl mb-4" aria-hidden="true">
          🤝
        </div>
        <p className="text-white font-medium">
          Your mentorship sessions will appear here. Browse alumni and request
          a session to get started.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/alumni")}
            className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2 hover:brightness-110 transition-all"
          >
            Find Alumni
          </button>
        </div>
      </div>
    </div>
  );
}

