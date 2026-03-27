import * as mentorshipService from "./mentorship.service.js";
import AppError from "../../utils/AppError.js";
import { sendEmail } from "../../utils/sendEmail.js";

export async function createRequest(req, res, next) {
  try {
    if (String(req.user?.role) !== "STUDENT") {
      throw new AppError("Only students can request mentorship", 403);
    }

    const { alumniId, date, time } = req.body;
    if (!alumniId || !date || !time) {
      throw new AppError("alumniId, date, and time are required", 400);
    }

    const request = await mentorshipService.createRequest({
      studentId: req.user.id,
      alumniId,
      date,
      time,
    });

    if (request.alumni?.email) {
      const studentName = request.student?.name || "A student";
      const formattedDate = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      sendEmail({
        to: request.alumni.email,
        subject: `New Mentorship Request from ${studentName}`,
        text: `Hi ${request.alumni.name || "there"},\n\nYou have received a new mentorship session request from ${studentName}.\n\nDate: ${formattedDate}\nTime: ${time}\n\nPlease log in to your AlumNext dashboard to approve or reject this request.\n\n— AlumNext Team`,
        html: `<p>Hi <strong>${request.alumni.name || "there"}</strong>,</p>
               <p>You have received a new mentorship session request from <strong>${studentName}</strong>.</p>
               <ul>
                 <li><strong>Date:</strong> ${formattedDate}</li>
                 <li><strong>Time:</strong> ${time}</li>
               </ul>
               <p>Please <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login">log in to your AlumNext dashboard</a> to approve or reject this request.</p>
               <p>— AlumNext Team</p>`,
      });
    }

    res.status(201).json({ success: true, data: { request } });
  } catch (err) {
    next(err);
  }
}

export async function getAlumniRequests(req, res, next) {
  try {
    if (String(req.user?.role) !== "ALUMNI") {
      throw new AppError("Only alumni can view mentorship requests", 403);
    }

    const requests = await mentorshipService.getRequestsForAlumni(req.user.id);
    res.status(200).json({ success: true, data: { requests } });
  } catch (err) {
    next(err);
  }
}

export async function getStudentRequests(req, res, next) {
  try {
    if (String(req.user?.role) !== "STUDENT") {
      throw new AppError("Only students can view their mentorship requests", 403);
    }

    const requests = await mentorshipService.getRequestsForStudent(req.user.id);
    res.status(200).json({ success: true, data: { requests } });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    if (String(req.user?.role) !== "ALUMNI") {
      throw new AppError("Only alumni can approve/reject requests", 403);
    }

    const { status } = req.body;
    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      throw new AppError("Status must be APPROVED or REJECTED", 400);
    }

    const updated = await mentorshipService.updateRequestStatus(
      req.params.id,
      req.user.id,
      status
    );

    // Send email notification to student on status change (non-blocking)
    if (updated.student?.email) {
      const isApproved = status === "APPROVED";
      const alumniName = updated.alumni?.name || "Your mentor";
      const formattedDate = new Date(updated.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      
      const subject = isApproved 
        ? `Mentorship Session Approved: ${alumniName}`
        : `Mentorship Session Update: ${alumniName}`;

      const textBody = isApproved
        ? `Great news! ${alumniName} has approved your mentorship session for ${formattedDate} at ${updated.time}. Please check your dashboard for details.`
        : `${alumniName} is unable to accept your mentorship request for ${formattedDate} at ${updated.time} at this time.`;

      sendEmail({
        to: updated.student.email,
        subject,
        text: `Hi ${updated.student.name || "there"},\n\n${textBody}\n\n— AlumNext Team`,
        html: `<p>Hi <strong>${updated.student.name || "there"}</strong>,</p>
               <p>${textBody}</p>
               <p>Please <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login">log in to your dashboard</a> for more details.</p>
               <p>— AlumNext Team</p>`,
      });
    }

    res.status(200).json({ success: true, data: { request: updated } });
  } catch (err) {
    next(err);
  }
}
