import { prisma } from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

// POST /api/ads
export async function createAd(req, res, next) {
  try {
    const { title, description, imageUrl, company, location, type, applyLink, lastDate } = req.body;
    
    // Authorization is handled via middleware (admin only), but double check here optionally.
    if (req.user.role !== "ADMIN") {
      throw new AppError("Forbidden: Admins only", 403);
    }

    const newAd = await prisma.advertisement.create({
      data: {
        title,
        description,
        imageUrl,
        company,
        location,
        type,
        applyLink,
        lastDate,
        createdBy: req.user.id,
      },
    });

    res.status(201).json({ success: true, data: { ad: newAd } });
  } catch (err) {
    next(err);
  }
}

// GET /api/ads
export async function getAds(req, res, next) {
  try {
    const rawAds = await prisma.advertisement.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Ads do not have a foreign key to user in schema.prisma, `createdBy` is just a string. 
    // Wait, let's look at schema.prisma. Yes it's just String. So we must fetch manually or just 
    // use a Prisma map. Let me do a manual fetch if it's a UUID, otherwise...
    // Actually, I should map over them and find the creator.
    const userIds = [...new Set(rawAds.map((a) => a.createdBy))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true },
    });
    const userMap = {};
    users.forEach((u) => { userMap[u.id] = u.email; });

    const ads = rawAds.map((a) => ({
      ...a,
      creatorEmail: userMap[a.createdBy] || null,
    }));

    res.status(200).json({ success: true, data: { ads } });
  } catch (err) {
    next(err);
  }
}
