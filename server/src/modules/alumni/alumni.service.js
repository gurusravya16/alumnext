import { prisma } from "../../lib/prisma.js"; 

export async function listApprovedAlumni({ branch, year } = {}) {
  const where = {
    role: "ALUMNI",
    status: "APPROVED",
    ...(branch ? { branch } : {}),
    ...(year ? { year } : {}),
  };

  const alumni = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      branch: true,
      year: true,
      linkedin: true,
      jobTitle: true,
      company: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return alumni.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    branch: u.branch,
    year: u.year,
    linkedin: u.linkedin,
    jobTitle: u.jobTitle,
    company: u.company,
  }));
}

