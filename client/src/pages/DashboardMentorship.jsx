import { useNavigate } from "react-router-dom";
import { HandshakeIcon } from "../components/ui/OutlineIcons";

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
        <div className="mb-4" aria-hidden="true">
          <HandshakeIcon className="w-10 h-10 text-[#f0b429] drop-shadow-[0_0_16px_rgba(240,180,41,0.16)]" />
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

