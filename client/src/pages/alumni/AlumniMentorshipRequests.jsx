import { useState } from "react";
import Avatar from "../../components/dashboard/Avatar";

function formatDateTime(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const PLACEHOLDER_REQUESTS = [
  {
    id: "r1",
    studentName: "Student One",
    requestedAt: new Date().toISOString(),
    timeSlot: "10:00 AM – 10:30 AM",
    note: "Optional note from student",
  },
  {
    id: "r2",
    studentName: "Student Two",
    requestedAt: new Date().toISOString(),
    timeSlot: "2:00 PM – 2:30 PM",
    note: "",
  },
];

export default function AlumniMentorshipRequests() {
  const [tab, setTab] = useState("Pending");
  const [pending, setPending] = useState(PLACEHOLDER_REQUESTS);
  const [confirmed, setConfirmed] = useState([]);

  const [contactOpen, setContactOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  const studentEmail = activeRequest ? "student@example.com" : "";
  const studentPhone = "9000000000";

  const [shareEmail, setShareEmail] = useState(false);
  const [sharePhone, setSharePhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(studentPhone);

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  function toast(msg) {
    setToastMessage(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 6000);
  }

  function onAccept(req) {
    setActiveRequest(req);
    setShareEmail(false);
    setSharePhone(false);
    setPhoneValue(studentPhone);
    setContactOpen(true);
  }

  function onDecline(req) {
    const ok = window.confirm("Are you sure you want to decline this request?");
    if (!ok) return;
    setPending((prev) => prev.filter((r) => r.id !== req.id));
    toast("Request declined.");
  }

  function moveToConfirmed(req) {
    setPending((prev) => prev.filter((r) => r.id !== req.id));
    setConfirmed((prev) => [
      { ...req, confirmedAt: new Date().toISOString() },
      ...prev,
    ]);
  }

  const list = tab === "Pending" ? pending : confirmed;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Mentorship Requests</h1>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setTab("Pending")}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 font-bold ${
            tab === "Pending"
              ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
              : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
          }`}
        >
          Pending
        </button>
        <button
          type="button"
          onClick={() => setTab("Confirmed")}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 font-bold ${
            tab === "Confirmed"
              ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
              : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
          }`}
        >
          Confirmed
        </button>
      </div>

      {list.length === 0 ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center text-[#8892a4]">
          {tab === "Pending" ? "No pending mentorship requests." : "No confirmed sessions yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((req) => (
            <div
              key={req.id}
              className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <Avatar name={req.studentName} size={56} />
                <div className="min-w-0">
                  <div className="text-white font-bold truncate">
                    {req.studentName}
                  </div>
                  <div className="text-[#8892a4] text-sm mt-1 whitespace-nowrap">
                    Requested: {formatDateTime(req.requestedAt)}
                  </div>
                  <div className="text-white text-sm mt-2">{req.timeSlot}</div>
                  {req.note ? (
                    <div className="text-[#8892a4] text-sm mt-2">
                      Note: {req.note}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 items-end shrink-0">
                <button
                  type="button"
                  onClick={() => onAccept(req)}
                  className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => onDecline(req)}
                  className="rounded-lg border border-red-500/40 bg-transparent text-red-300 px-4 py-2.5 text-sm font-bold hover:bg-red-500/10 transition-all duration-200"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact share modal */}
      {contactOpen && activeRequest ? (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-3 z-[310] rounded-lg bg-white/5 text-white hover:bg-white/10 w-9 h-9 flex items-center justify-center text-xl"
              aria-label="Close"
            >
              ×
            </button>

            <div className="p-5 border-b border-[#1e3a5f]">
              <div className="text-white font-bold text-lg">Share Contact for This Session</div>
              <div className="text-[#8892a4] text-sm mt-1">
                {activeRequest.studentName} has been notified.
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-[#cbd5e1] text-sm">
                  <input
                    type="checkbox"
                    checked={shareEmail}
                    onChange={(e) => setShareEmail(e.target.checked)}
                    className="accent-[#f0b429]"
                  />
                  Share my Email
                </label>
                <input
                  value={studentEmail}
                  readOnly
                  disabled={!shareEmail}
                  className={`w-full rounded-lg px-4 py-2.5 text-sm border transition-all duration-200 ${
                    shareEmail
                      ? "bg-[#0a1628] border-[#1e3a5f] text-white"
                      : "bg-[#0a1628] border-[#1e3a5f] text-[#8892a4] opacity-60 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-3 text-[#cbd5e1] text-sm">
                  <input
                    type="checkbox"
                    checked={sharePhone}
                    onChange={(e) => setSharePhone(e.target.checked)}
                    className="accent-[#f0b429]"
                  />
                  Share my Phone Number
                </label>
                <input
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  disabled={!sharePhone}
                  className={`w-full rounded-lg px-4 py-2.5 text-sm border transition-all duration-200 ${
                    sharePhone
                      ? "bg-[#0a1628] border-[#1e3a5f] text-white"
                      : "bg-[#0a1628] border-[#1e3a5f] text-[#8892a4] opacity-60 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="text-[#8892a4] text-sm">
                This information will be sent to the student via the T&amp;P office email.
              </div>

              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
                  onClick={async () => {
                    // TODO: POST /api/mentorship/confirm + trigger email
                    await new Promise((r) => setTimeout(r, 1000));
                    moveToConfirmed(activeRequest);
                    setContactOpen(false);
                    toast(
                      `Session confirmed! Contact details have been sent to ${activeRequest.studentName} via the T&P email.`
                    );
                  }}
                >
                  Send &amp; Confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    moveToConfirmed(activeRequest);
                    setContactOpen(false);
                  }}
                  className="text-[#8892a4] text-sm hover:text-white transition-all duration-200"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Bottom-right toast */}
      {toastOpen ? (
        <div className="fixed bottom-6 right-6 z-[500] w-[340px] max-w-[calc(100vw-2rem)]">
          <div className="bg-[#112240] border border-[#1e3a5f] border-l-4 border-[#f0b429] text-white rounded-xl px-4 py-3 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm leading-relaxed">{toastMessage}</div>
              <button
                type="button"
                onClick={() => setToastOpen(false)}
                className="text-white/90 hover:text-white"
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

