import nodemailer from "nodemailer";

/**
 * Send an email via nodemailer.
 * Falls back to Ethereal (test) transport if SMTP env vars are missing.
 * Does NOT throw — logs errors only, so callers are never blocked.
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production SMTP (Gmail, SendGrid, etc.)
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Ethereal test account (no real email sent)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"AlumNext" <noreply@alumnext.com>',
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    console.log(`[Email] Sent to ${to} — MessageId: ${info.messageId}`);
    if (!process.env.SMTP_HOST) {
      // Log preview URL for Ethereal in dev
      console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    console.error("[Email] Failed to send email:", err.message);
    // Do NOT rethrow — email failure must never block API responses
  }
}
