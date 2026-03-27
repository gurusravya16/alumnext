import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

export async function createRequest({ studentId, alumniId, date, time }) {
  // Verify the alumni exists and has ALUMNI role
  const alumni = await prisma.user.findUnique({ where: { id: alumniId } });
  if (!alumni || alumni.role !== "ALUMNI") {
    throw new AppError("Alumni not found", 404);
  }

  const request = await prisma.mentorshipRequest.create({
    data: { studentId, alumniId, date: new Date(date), time },
    include: {
      student: { select: { id: true, name: true, email: true } },
      alumni: { select: { id: true, name: true, email: true } },
    },
  });
  return request;
}

export async function getRequestsForAlumni(alumniId) {
  return prisma.mentorshipRequest.findMany({
    where: { alumniId },
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getRequestsForStudent(studentId) {
  return prisma.mentorshipRequest.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: {
      alumni: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function updateRequestStatus(requestId, alumniId, status) {
  const request = await prisma.mentorshipRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError("Mentorship request not found", 404);
  }

  if (request.alumniId !== alumniId) {
    throw new AppError("Only the assigned alumni can update this request", 403);
  }

  const updated = await prisma.mentorshipRequest.update({
    where: { id: requestId },
    data: { status },
    include: {
      student: { select: { id: true, name: true, email: true } },
      alumni: { select: { id: true, name: true, email: true } },
    },
  });
  return updated;
}
