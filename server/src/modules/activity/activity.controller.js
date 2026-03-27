import { prisma } from "../../lib/prisma.js";

// GET /api/activity/me
export async function getMyActivity(req, res, next) {
  try {
    const userId = req.user.id;
    const role = req.user.role; // "STUDENT" or "ALUMNI"

    // 1. Fetch recent posts by this user
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const postActivities = posts.map(p => ({
      id: `post-${p.id}`,
      text: `You shared a new update: "${p.title}"`,
      date: p.createdAt,
    }));

    // 2. Fetch recent mentorships
    // If student: mentorships where studentId = userId
    // If alumni: mentorships where alumniId = userId
    let mentorships = [];
    if (role === "ALUMNI") {
      mentorships = await prisma.mentorshipRequest.findMany({
        where: { alumniId: userId },
        include: { student: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
    } else {
      mentorships = await prisma.mentorshipRequest.findMany({
        where: { studentId: userId },
        include: { alumni: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
    }

    const mentorshipActivities = mentorships.map(m => {
      let text = "";
      if (role === "ALUMNI") {
        text = `New mentorship request from ${m.student?.name || "a user"}`;
      } else {
        text = `Requested a mentorship session with ${m.alumni?.name || "an alumni"}`;
      }
      return {
        id: `mentorship-${m.id}`,
        text,
        date: m.createdAt,
      };
    });

    // Merge and sort
    const allActivity = [...postActivities, ...mentorshipActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Take top 5 overall

    res.status(200).json({ success: true, data: { activity: allActivity } });
  } catch (err) {
    next(err);
  }
}
