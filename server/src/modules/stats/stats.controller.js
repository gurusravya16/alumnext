import { prisma } from "../../lib/prisma.js";

// GET /api/stats/dashboard
export async function getDashboardStats(req, res, next) {
  try {
    const [adsCount, postsCount, alumniCount] = await Promise.all([
      prisma.advertisement.count(),
      prisma.post.count(),
      prisma.user.count({ where: { role: "ALUMNI" } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        adsCount,
        postsCount,
        alumniCount,
      },
    });
  } catch (err) {
    next(err);
  }
}
