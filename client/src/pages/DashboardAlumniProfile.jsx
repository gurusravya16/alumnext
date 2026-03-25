import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import AlumniPostCard from "../components/alumni/AlumniPostCard";
import Avatar from "../components/dashboard/Avatar";
import { useAuth } from "../context/AuthContext";
import MentorshipBookingModal from "../components/mentorship/MentorshipBookingModal";
import MentorshipSuccessToast from "../components/mentorship/MentorshipSuccessToast";

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
    profilePhotoBase64: null,
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
    profilePhotoBase64: null,
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
    profilePhotoBase64: null,
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
    profilePhotoBase64: null,
  },
];

function formatDateTime(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardAlumniProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const alumni = useMemo(() => ALUMNI.find((a) => String(a.id) === String(id)), [id]);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [commentsByPostId, setCommentsByPostId] = useState({});

  const currentUserId = user?.id ?? null;
  const currentUserName = user?.name ?? "Student";

  async function fetchPosts() {
    setLoadingPosts(true);
    try {
      const { data } = await api.get("/posts");
      const list = data?.data?.posts ?? data?.posts ?? [];
      const normalized = Array.isArray(list)
        ? list.map((p) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt,
            authorId: p.authorId,
            authorName: p.author?.name ?? "Anonymous",
          }))
        : [];

      // Prefer authorId matching (when ids align). Fallback to authorName matching.
      const byId = normalized.filter((p) => String(p.authorId) === String(id));
      const byName =
        byId.length > 0
          ? byId
          : normalized.filter((p) => String(p.authorName) === alumni?.fullName);

      setPosts(byName);
    } catch {
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => {
    if (!alumni) return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alumni?.id]);

  function onAddComment(postId, text) {
    // TODO: Sprint 4 - connect to backend comments storage.
    const newComment = {
      id: String(Date.now()),
      authorId: currentUserId ?? "unknown",
      authorName: currentUserName,
      text,
      createdAt: new Date().toISOString(),
    };

    setCommentsByPostId((prev) => {
      const existing = prev[postId] ?? [];
      return { ...prev, [postId]: [newComment, ...existing] };
    });
  }

  function onDeleteComment(postId, commentId) {
    // TODO: Sprint 4 - connect to backend comment deletion.
    if (currentUserId == null) return;
    setCommentsByPostId((prev) => {
      const existing = prev[postId] ?? [];
      const updated = existing.filter((c) => {
        if (String(c.id) !== String(commentId)) return true;
        return String(c.authorId) !== String(currentUserId);
      });
      return { ...prev, [postId]: updated };
    });
  }

  if (!alumni) {
    return (
      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center">
        <div className="text-white font-bold text-xl">Alumni not found</div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/alumni")}
          className="mt-4 rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2 hover:brightness-110 transition-all"
        >
          Back to Alumni
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
          <div className="flex items-start gap-5">
            <Avatar name={alumni.fullName} src={alumni.profilePhotoBase64 || undefined} size={96} />
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white">{alumni.fullName}</h1>
              <div className="text-[#8892a4] text-sm mt-2">
                {alumni.batchYear} · {alumni.branchFull || alumni.branch}
              </div>
              <div className="text-white font-medium mt-3">
                {alumni.jobTitle} at {alumni.company}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end w-full md:w-auto">
            {alumni.linkedInUrl ? (
              <a
                href={alumni.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#f0b429]/40 text-[#f0b429] px-4 py-2 text-sm font-semibold hover:bg-[#f0b429]/10 transition-all duration-200 text-center"
              >
                LinkedIn
              </a>
            ) : null}

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
            >
              Book Mentorship
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/alumni")}
              className="rounded-lg border border-[#f0b429]/40 bg-transparent text-[#f0b429] px-4 py-2.5 text-sm font-semibold hover:bg-[#f0b429]/10 transition-all duration-200"
            >
              Back
            </button>
          </div>
        </div>

        <div className="mt-5">
          {alumni.bio ? (
            <div className="text-[#cbd5e1] text-sm leading-relaxed">
              <span className="text-white font-semibold">About: </span>
              {alumni.bio}
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Posts by this Alumni</h2>

        {loadingPosts ? (
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 text-[#8892a4]">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center">
            <div className="text-[#8892a4] font-medium">
              No posts yet from {alumni.fullName}.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <AlumniPostCard
                key={p.id}
                post={p}
                comments={commentsByPostId[p.id] ?? []}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
              />
            ))}
          </div>
        )}
      </div>

      <MentorshipBookingModal
        open={bookingOpen}
        alumniName={alumni.fullName}
        onClose={() => setBookingOpen(false)}
        onBookedSuccess={() => setToastOpen(true)}
      />

      <MentorshipSuccessToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}

