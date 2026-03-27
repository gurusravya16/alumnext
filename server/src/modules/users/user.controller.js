import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

// GET /api/users/:id
export async function getUserProfile(req, res, next) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        branch: true,
        year: true,
        bio: true,
        linkedin: true,
        profileImage: true,
        company: true,
        jobTitle: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/profile
export async function updateUserProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, bio, linkedin, profileImage, company, jobTitle, branch, year } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        linkedin,
        profileImage,
        company,
        jobTitle,
        branch,
        year,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        branch: true,
        year: true,
        bio: true,
        linkedin: true,
        profileImage: true,
        company: true,
        jobTitle: true,
        createdAt: true,
      },
    });

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
