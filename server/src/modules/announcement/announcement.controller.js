import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

// GET /api/announcements — public
export async function listAnnouncements(req, res, next) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.status(200).json({ success: true, data: { announcements } });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/announcements — admin only
export async function createAnnouncement(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      throw new AppError("Title and content are required", 400);
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
      },
    });

    res.status(201).json({ success: true, data: { announcement } });
  } catch (err) {
    next(err);
  }
}
