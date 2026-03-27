import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

// GET /api/admin/stats
export async function getAdminStats(req, res, next) {
  try {
    const [totalUsers, totalAlumni, pendingApprovals, activeAds, totalPosts, totalMentorships] = await Promise.all([
      prisma.user.count({ where: { role: { not: "ADMIN" } } }),
      prisma.user.count({ where: { role: "ALUMNI", status: "APPROVED" } }),
      prisma.user.count({ where: { role: "ALUMNI", status: "PENDING" } }),
      prisma.advertisement.count(),
      prisma.post.count(),
      prisma.mentorshipRequest.count(),
    ]);
    res.status(200).json({ success: true, data: { totalUsers, totalAlumni, pendingApprovals, activeAds, totalPosts, totalMentorships } });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/approvals  — pending alumni
export async function getPendingApprovals(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: "ALUMNI", status: "PENDING" },
      select: {
        id: true, name: true, email: true, branch: true, year: true,
        linkedin: true, bio: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: { users } });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/approvals/:id/approve
export async function approveUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status: "APPROVED" },
      select: { id: true, name: true, email: true, status: true },
    });
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/approvals/:id/reject
export async function rejectUser(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users — all non-admin users, with optional filters
export async function getAllUsers(req, res, next) {
  try {
    const { role, year, branch, jobTitle } = req.query;

    const where = { role: { not: "ADMIN" } };
    if (role && ["STUDENT", "ALUMNI"].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }
    if (year) where.year = parseInt(year, 10);
    if (branch) where.branch = { contains: branch, mode: "insensitive" };
    if (jobTitle) where.jobTitle = { contains: jobTitle, mode: "insensitive" };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, role: true,
        status: true, branch: true, year: true, company: true,
        jobTitle: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, data: { users } });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (id === req.user.id) throw new AppError("Cannot delete yourself", 400);
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}
