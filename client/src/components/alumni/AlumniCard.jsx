import { Link } from "react-router-dom";
import Avatar from "../dashboard/Avatar";
import { BriefcaseIcon, LinkedInIcon, CheckIcon } from "../ui/OutlineIcons";

export default function AlumniCard({ alumni }) {
  const jobLine =
    alumni?.jobTitle && alumni?.company
      ? `${alumni.jobTitle} at ${alumni.company}`
      : alumni?.jobTitle
        ? alumni.jobTitle
        : "Alumni";

  return (
    <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <Avatar
          name={alumni?.fullName}
          src={alumni?.profilePhotoBase64 || undefined}
          size={52}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-white font-bold truncate">{alumni?.fullName}</div>
            {alumni?.verified !== false ? (
              <span
                className="inline-flex items-center justify-center rounded-full bg-[#f0b429]/15 border border-[#f0b429]/40 px-2 py-0.5"
                title="Verified Alumni"
              >
                <CheckIcon className="w-3.5 h-3.5 text-[#f0b429]" />
              </span>
            ) : null}
          </div>
          <div className="text-[#8892a4] text-sm">
            {alumni?.batchYear} · {alumni?.branchFull || alumni?.branch}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-white font-medium flex items-center gap-2">
          <BriefcaseIcon className="w-4 h-4 text-[#f0b429]" />
          <span className="truncate">
            {jobLine}
          </span>
        </div>
        {alumni?.careerIndustry ? (
          <div className="text-[#8892a4] text-sm mt-1">{alumni?.careerIndustry}</div>
        ) : null}
      </div>

      {alumni?.linkedInUrl ? (
        <a
          href={alumni.linkedInUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center mt-4 w-full rounded-lg border border-[#f0b429]/40 text-[#f0b429] py-2 text-sm font-semibold hover:bg-[#f0b429]/10 transition-all duration-200 gap-2"
        >
          <LinkedInIcon className="w-4 h-4" />
          LinkedIn
        </a>
      ) : null}

      <div className="mt-4">
        <Link
          to={`/dashboard/alumni/${alumni.id}`}
          className="block w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition-all duration-200 text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

