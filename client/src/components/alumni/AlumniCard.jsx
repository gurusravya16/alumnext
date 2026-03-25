import { Link } from "react-router-dom";
import Avatar from "../dashboard/Avatar";

export default function AlumniCard({ alumni }) {
  return (
    <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <Avatar
          name={alumni?.fullName}
          src={alumni?.profilePhotoBase64 || undefined}
          size={52}
        />
        <div className="min-w-0">
          <div className="text-white font-bold truncate">
            {alumni?.fullName}
          </div>
          <div className="text-[#8892a4] text-sm">
            {alumni?.batchYear} · {alumni?.branchFull || alumni?.branch}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-white font-medium flex items-center gap-2">
          <span aria-hidden="true">💼</span>
          <span className="truncate">
            {alumni?.jobTitle} at {alumni?.company}
          </span>
        </div>
        <div className="text-[#8892a4] text-sm mt-1">
          {alumni?.careerIndustry}
        </div>
      </div>

      {alumni?.linkedInUrl ? (
        <a
          href={alumni.linkedInUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center mt-4 w-full rounded-lg border border-[#f0b429]/40 text-[#f0b429] py-2 text-sm font-semibold hover:bg-[#f0b429]/10 transition-all duration-200"
        >
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

